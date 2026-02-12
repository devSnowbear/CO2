import { ref, onValue, off, query, orderByKey, limitToLast } from "firebase/database";
import { rtdb } from "./firebase";
import { sendLocalNotification } from "../services/notificationService";

export type RealtimeReading = {
  co2?: number;
  temperature?: number;
  humidity?: number;
  timestamp?: string;
};

let lastAlertTime = 0;
const ALERT_COOLDOWN = 5 * 60 * 1000; // 5 minutes between alerts

export function subscribeToRealtimeReadings(
  callback: (reading: RealtimeReading | null) => void
) {
  const readingsRef = ref(rtdb, "sensorData");
  
  const readingsQuery = query(
    readingsRef,
    orderByKey(),
    limitToLast(1)
  );

  const unsubscribe = onValue(
    readingsQuery,
    (snapshot) => {
      if (snapshot.exists()) {
        const data = snapshot.val();
        const latestKey = Object.keys(data)[0];
        const latestReading = data[latestKey] as RealtimeReading;

        console.log("🔥 RTDB Latest key:", latestKey);
        console.log("🔥 RTDB CO2:", latestReading.co2);

        // ✅ Check thresholds and send notification
        checkThresholdsAndNotify(latestReading);

        callback(latestReading);
      } else {
        console.log("🔥 RTDB: No data found");
        callback(null);
      }
    },
    (error) => {
      console.error("🔥 RTDB ERROR:", error);
      callback(null);
    }
  );

  return () => off(readingsRef);
}

function checkThresholdsAndNotify(reading: RealtimeReading) {
  const now = Date.now();
  
  // Cooldown to avoid spam
  if (now - lastAlertTime < ALERT_COOLDOWN) return;

  const co2 = reading.co2 ?? 0;
  const temp = reading.temperature ?? 0;
  const humid = reading.humidity ?? 0;

  if (co2 > 1000) {
    sendLocalNotification(
      "⚠️ High CO2 Alert",
      `CO2 level is ${co2} ppm, exceeding safe threshold!`
    );
    lastAlertTime = now;
  } else if (temp > 35) {
    sendLocalNotification(
      "🌡️ High Temperature Alert",
      `Temperature is ${temp.toFixed(1)}°C!`
    );
    lastAlertTime = now;
  } else if (humid > 80) {
    sendLocalNotification(
      "💧 High Humidity Alert",
      `Humidity is ${humid.toFixed(1)}%!`
    );
    lastAlertTime = now;
  }
}