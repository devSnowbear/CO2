import { db } from "./firebase";
import { collection, getDocs } from "firebase/firestore";

export type Reading = {
  id: string;
  actual?: {
    co2?:  number;
    humidity?: number;
    temperature?: number;
    createdAt?: any;
    dataPointsCount?: number;
  };
  predicted?: {
    co2?: number;
    humidity?: number;
    temperature?: number;
    timestamp?: any;
    timestampString?: string;
  };
};

export async function fetchLatestReading(): Promise<Reading | null> {
  try {
    console.log("Fetching all documents...");
    const snapshot = await getDocs(collection(db, "sensorReadings"));
    console.log("Total documents:", snapshot.size);

    if (snapshot. empty) return null;

    const allDocs = snapshot.docs.map(
      (doc) =>
        ({
          id: doc.id,
          ... doc.data(),
        } as Reading)
    );

    // Sort by document ID descending (newest first)
    allDocs.sort((a, b) => {
      const idA = parseInt(a.id);
      const idB = parseInt(b. id);
      return idB - idA;
    });

    console.log("Latest document ID:", allDocs[0]. id);
    console.log("Latest data:", allDocs[0]);

    return allDocs[0];
  } catch (error) {
    console.error("ERROR:", error);
    throw error;
  }
}

// Fetch last 13 documents for chart (12 previous + 1 actual)
export async function fetchChartReadings(): Promise<Reading[] | null> {
  try {
    const snapshot = await getDocs(collection(db, "sensorReadings"));

    if (snapshot. empty) return null;

    const allDocs = snapshot.docs.map(
      (doc) =>
        ({
          id: doc.id,
          ...doc. data(),
        } as Reading)
    );

    // Sort by document ID descending (newest first)
    allDocs. sort((a, b) => {
      const idA = parseInt(a.id);
      const idB = parseInt(b. id);
      return idB - idA;
    });

    // Get last 13 documents, then reverse to oldest first
    return allDocs.slice(0, 13).reverse();
  } catch (error) {
    console.error("ERROR fetching chart readings:", error);
    throw error;
  }
}

// Format timestamp to time label (e.g., "6: 15 PM")
export function formatTimeLabel(timestampMs: string | number): string {
  const date = new Date(
    typeof timestampMs === "string" ? parseInt(timestampMs) : timestampMs
  );
  return date.toLocaleTimeString("en-US", {
    hour: "numeric",
    minute:  "2-digit",
    hour12: true,
  });
}