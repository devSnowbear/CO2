const { onValueCreated } = require("firebase-functions/v2/database");
const admin = require("firebase-admin");

admin.initializeApp();

const db = admin.firestore();
const rtdb = admin.database();

const fifteenMinutesMs = 15 * 60 * 1000; // 900,000 ms

exports.processSensorData = onValueCreated(
  {
    ref: "/sensorData/{timestamp}",
    region: "asia-southeast1",
  },
  async (event) => {
    try {
      const newData = event.data.val();
      const timestampKey = event.params.timestamp;

      console.log("=== NEW TRIGGER ===");
      console.log("Timestamp key:", timestampKey);
      console.log("New sensor data:", newData);

      // Parse device-provided timestamp (used for doc ID and display)
      let deviceTsMs = parseInt(timestampKey);
      if (typeof timestampKey === "string" && timestampKey.includes(".")) {
        deviceTsMs = Math.floor(parseFloat(timestampKey));
      }
      if (Number.isNaN(deviceTsMs)) {
        console.error("❌ Invalid timestamp key, aborting.");
        return null;
      }
      if (deviceTsMs.toString().length === 10) {
        deviceTsMs = deviceTsMs * 1000; // seconds -> ms
      }

      console.log("Device timestamp (ms):", deviceTsMs, "Date:", new Date(deviceTsMs).toISOString());

      const lastWriteRef = rtdb.ref("/lastFirestoreWrite");

      // Atomic check-and-set using server time to avoid races
      const txnResult = await lastWriteRef.transaction(
        (last) => {
          const nowServer = Date.now();
          if (!last || nowServer - last >= fifteenMinutesMs) {
            return nowServer; // claim the slot
          }
          return; // abort transaction
        },
        null,  // onComplete callback (none)
        false  // applyLocally
      );

      if (!txnResult.committed) {
        const last = txnResult.snapshot.val() || 0;
        const elapsed = Date.now() - last;
        const remainingMs = Math.max(fifteenMinutesMs - elapsed, 0);
        console.log(
          `⏳ Skipping: only ${Math.floor(elapsed / 1000)}s since last write. Need ${Math.ceil(
            remainingMs / 1000
          )}s more.`
        );
        return null;
      }

      const nowServer = txnResult.snapshot.val();
      console.log("✅ Claimed 15-min slot at server time:", nowServer);

      // Use server time window to avoid device clock drift
      const windowStart = nowServer - fifteenMinutesMs;
      console.log(
        "Fetching data from (server window)",
        new Date(windowStart).toISOString(),
        "to",
        new Date(nowServer).toISOString()
      );

      // Fetch all data from the last 15 minutes (by key range)
      const last15MinSnapshot = await rtdb
        .ref("/sensorData")
        .orderByKey()
        .startAt(windowStart.toString())
        .endAt(nowServer.toString())
        .once("value");

      const dataPoints = [];
      last15MinSnapshot.forEach((childSnapshot) => {
        const data = childSnapshot.val();
        const ts = parseInt(childSnapshot.key);
        if (
          data &&
          data.temperature !== undefined &&
          data.humidity !== undefined &&
          data.co2 !== undefined &&
          !Number.isNaN(ts)
        ) {
          dataPoints.push({
            timestamp: ts,
            temperature: parseFloat(data.temperature),
            humidity: parseFloat(data.humidity),
            co2: parseFloat(data.co2),
          });
        }
      });

      console.log(`✅ Found ${dataPoints.length} data points in last 15 minutes`);

      if (dataPoints.length === 0) {
        console.log("⚠️ Not enough data yet. Skipping Firestore write...");
        return null;
      }

      // Calculate 15-minute averages (MEAN)
      const avgTemperature = average(dataPoints.map((d) => d.temperature));
      const avgHumidity = average(dataPoints.map((d) => d.humidity));
      const avgCO2 = average(dataPoints.map((d) => d.co2));

      console.log("📊 15-min averages:", {
        temperature: avgTemperature,
        humidity: avgHumidity,
        co2: avgCO2,
      });

      // Linear regression predictions
      const timestamps = dataPoints.map((d) => d.timestamp);
      const tempPrediction = predictNext(timestamps, dataPoints.map((d) => d.temperature));
      const humidityPrediction = predictNext(timestamps, dataPoints.map((d) => d.humidity));
      const co2Prediction = predictNext(timestamps, dataPoints.map((d) => d.co2));

      console.log("🔮 Predictions:", {
        temperature: tempPrediction,
        humidity: humidityPrediction,
        co2: co2Prediction,
      });

      // Store in Firestore (once per claimed slot)
      const firestoreData = {
        timestamp: admin.firestore.Timestamp.fromMillis(deviceTsMs),
        timestampString: newData.timestamp || new Date(deviceTsMs).toISOString(),
        actual: {
          temperature: avgTemperature,
          humidity: avgHumidity,
          co2: avgCO2,
        },
        predicted: {
          temperature: tempPrediction,
          humidity: humidityPrediction,
          co2: co2Prediction,
        },
        dataPointsCount: dataPoints.length,
        createdAt: admin.firestore.FieldValue.serverTimestamp(),
        writeClaimedAtServerMs: nowServer,
      };

      console.log("💾 Writing to Firestore with doc ID:", timestampKey);
      await db.collection("sensorReadings").doc(timestampKey).set(firestoreData);

      console.log("🎉 Data successfully stored in Firestore!");
      console.log("=== END TRIGGER ===\n");

      return null;
    } catch (error) {
      console.error("❌ Error processing sensor data:", error);
      console.error("Stack:", error.stack);
      return null;
    }
  }
);

// Helper function: Calculate average
function average(arr) {
  if (arr.length === 0) return 0;
  const validValues = arr.filter((v) => !isNaN(v) && v !== null && v !== undefined);
  if (validValues.length === 0) return 0;
  const sum = validValues.reduce((a, b) => a + b, 0);
  return parseFloat((sum / validValues.length).toFixed(2));
}

// Helper function: Linear regression prediction
function predictNext(x, y) {
  const n = x.length;
  if (n < 2) return y[y.length - 1] || 0;

  const xMean = average(x);
  const yMean = average(y);

  let numerator = 0;
  let denominator = 0;

  for (let i = 0; i < n; i++) {
    numerator += (x[i] - xMean) * (y[i] - yMean);
    denominator += (x[i] - xMean) * (x[i] - xMean);
  }

  const slope = denominator !== 0 ? numerator / denominator : 0;
  const intercept = yMean - slope * xMean;

  const nextTimestamp = x[x.length - 1] + fifteenMinutesMs; // predict 15 minutes ahead
  const prediction = slope * nextTimestamp + intercept;

  return parseFloat(prediction.toFixed(2));
}