import { useEffect, useRef } from "react";
import * as Speech from "expo-speech";

type AlertThresholds = {
  moderate: number;
  critical: number;
};

let lastAlertTime = 0;
const ALERT_COOLDOWN = 5 * 60 * 1000; // 5 minutes between alerts

export function useVoiceAlert(
  co2: number,
  thresholds: AlertThresholds
) {
  const lastAlertRef = useRef<string>("");

  useEffect(() => {
    const now = Date.now();

    // Cooldown to avoid spam
    if (now - lastAlertTime < ALERT_COOLDOWN && lastAlertRef.current !== "") return;

    let alertMessage = "";

    // Check CO2 levels only
    if (co2 >= thresholds.critical) {
      alertMessage = `Critical CO2 levels detected at ${co2} parts per million! Immediate ventilation required!`;
    } else if (co2 > thresholds.moderate) {
      alertMessage = `Moderate CO2 levels detected at ${co2} parts per million. Consider improving ventilation.`;
    }

    // Only speak if there's a new alert and it's different from the last one
    if (alertMessage && alertMessage !== lastAlertRef.current) {
      Speech.speak(alertMessage, {
        language: "en-US",
        pitch: 1.0,
        rate: 0.85,
      });
      lastAlertRef.current = alertMessage;
      lastAlertTime = now;
      console.log("🔊 Voice Alert:", alertMessage);
    }

    // Clear alert if CO2 returns to normal
    if (!alertMessage) {
      lastAlertRef.current = "";
    }
  }, [co2, thresholds]);
}