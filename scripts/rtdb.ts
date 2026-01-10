import { ref, onValue, off, query, orderByKey, limitToLast } from "firebase/database";
import { rtdb } from "./firebase";

export type RealtimeReading = {
  co2? :  number;
  temperature?:  number;
  humidity?: number;
  timestamp?:  string;
};

export function subscribeToRealtimeReadings(
  callback: (reading: RealtimeReading | null) => void
) {
  // ✅ Fixed: Point to "sensorData" path, get only the latest 1
  const readingsRef = query(
    ref(rtdb, "sensorData"),  // ← Changed from ref(rtdb) to ref(rtdb, "sensorData")
    orderByKey(),
    limitToLast(1)
  );

  const unsubscribe = onValue(
    readingsRef,
    (snapshot) => {
      if (snapshot.exists()) {
        const data = snapshot.val();
        const latestKey = Object.keys(data)[0];
        const latestReading = data[latestKey] as RealtimeReading;

        console.log("🔥 RTDB Latest key:", latestKey);
        console.log("🔥 RTDB CO2:", latestReading.co2);

        callback(latestReading);
      } else {
        console.log("🔥 RTDB:  No data found");
        callback(null);
      }
    },
    (error) => {
      console.error("🔥 RTDB ERROR:", error);
      callback(null);
    }
  );

  return () => off(ref(rtdb, "sensorData"));
}