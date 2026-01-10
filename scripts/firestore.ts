import { db } from "./firebase";
import { collection, getDocs } from "firebase/firestore";

export type Reading = {
  id: string;
  actual?: {
    co2?: number;
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
    console.log('Fetching all documents...');
    const snapshot = await getDocs(collection(db, "sensorReadings"));
    console.log('Total documents:', snapshot.size);
    
    if (snapshot.empty) return null;

    const allDocs = snapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data()
    } as Reading));
    
    // Sort by document ID (which is a timestamp)
    allDocs.sort((a, b) => {
      const idA = parseInt(a.id);
      const idB = parseInt(b.id);
      return idB - idA; // Descending (newest first)
    });
    
    console.log('Latest document ID:', allDocs[0].id);
    console.log('Latest data:', allDocs[0]);
    
    return allDocs[0];
    
  } catch (error) {
    console.error('ERROR:', error);
    throw error;
  }
}