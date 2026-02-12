import { useEffect, useRef } from "react";
import Tts from "react-native-tts";

type ThresholdConfig = {
  co2?: number;
  temperature?: number;
  humidity?: number;
};

export function useVoiceAlert(
  co2: number,
  temperature: number,
  humidity: number,
  thresholds: ThresholdConfig = { co2: 1000, temperature: 35, humidity: 80 }
) {
  const lastAlertRef = useRef<string>("");

  useEffect(() => {
    let alertMessage = "";

    if (thresholds.co2 && co2 > thresholds.co2) {
      alertMessage = `Warning! CO2 level is ${co2} ppm, exceeding safe threshold.`;
    } else if (thresholds.temperature && temperature > thresholds.temperature) {
      alertMessage = `Warning! Temperature is ${temperature.toFixed(1)} degrees Celsius.`;
    } else if (thresholds.humidity && humidity > thresholds.humidity) {
      alertMessage = `Warning! Humidity is ${humidity.toFixed(1)} percent.`;
    }

    // Only speak if there's a new alert and it's different from the last one
    if (alertMessage && alertMessage !== lastAlertRef.current) {
      Tts.speak(alertMessage);
      lastAlertRef.current = alertMessage;
    }

    // Clear alert if values return to normal
    if (!alertMessage) {
      lastAlertRef.current = "";
    }
  }, [co2, temperature, humidity, thresholds]);
}