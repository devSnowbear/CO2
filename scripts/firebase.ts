import { initializeApp, getApps, getApp } from "firebase/app";
import { initializeFirestore } from "firebase/firestore";

const firebaseConfig = {
  apiKey: "AIzaSyBU69KkIqrNZ3tedo0F28oWze2WWzzGmeY",
  authDomain: "fir-4343a.firebaseapp.com",
  projectId: "fir-4343a",
  storageBucket: "fir-4343a.firebasestorage.app",
  messagingSenderId: "1008362354665",
  appId: "1:1008362354665:web:bc0d551656f17e87c0fd78",
  measurementId: "G-RFCM0TXHED",
};

const app = getApps().length ? getApp() : initializeApp(firebaseConfig);

export const db = initializeFirestore(app, {
  experimentalAutoDetectLongPolling: true,
  useFetchStreams: false,
});