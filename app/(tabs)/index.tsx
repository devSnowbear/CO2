import { Text, useColorScheme, View } from "react-native";
import React, { useEffect, useState } from "react";
import { AnimatedCircularProgress } from "react-native-circular-progress";
import { Colors } from "../../constants/theme";
import { LineChart } from "react-native-gifted-charts";
import Icon from "react-native-vector-icons/Feather";
import {
  fetchLatestReading,
  fetchChartReadings,
  formatTimeLabel,
  Reading,
} from "../../scripts/firestore";
import { createStyles, chartWidth } from "../../styles/appindex";
import { subscribeToRealtimeReadings, RealtimeReading } from "../../scripts/rtdb";

const HomeScreen = () => {
  const scheme = useColorScheme();
  const theme = Colors[scheme || "light"];

  const totalValue = 6000;

  const [reading, setReading] = useState<Reading | null>(null);
const [chartData, setChartData] = useState<any[]>([]);
const [yAxisConfig, setYAxisConfig] = useState({ min: 0, max: 600 }); // ✅ Add this

  const [realtimeReading, setRealtimeReading] = useState<RealtimeReading | null>(null);

  // Determine color based on value
  const getGaugeColor = (val: number) => {
    if (val <= 1000) return theme.ok;
    if (val <= 4999) return theme.warning;
    return theme.critical;
  };

  // Temperature (°C)
  const getTempColor = (t: number) => {
    if (t < 23) return theme.cool;
    if (t < 30) return theme.ok;
    if (t < 35) return theme.warning;
    return theme.critical;
  };

  // Humidity (RH %)
  const getHumidityColor = (h:  number) => {
    if (h < 40) return theme.cool;
    if (h < 70) return theme.ok;
    if (h < 80) return theme.warning;
    return theme.critical;
  };

    // Subscribe to RTDB for realtime gauge data
useEffect(() => {
  const unsubscribe = subscribeToRealtimeReadings((data) => {
    setRealtimeReading(data);
  });

  // Cleanup on unmount
  return () => unsubscribe();
}, []);

  useEffect(() => {
  (async () => {
    // Fetch latest reading for gauge
    const r = await fetchLatestReading();
    setReading(r);

    // Fetch chart readings
    const readings = await fetchChartReadings();

    if (readings && readings.length > 0) {
      const data:  any[] = [];

      // Add 12 previous + 1 actual (13 documents)
      readings.forEach((doc, index) => {
        const co2Value = doc. actual?. co2 ??  0;
        const timeLabel = formatTimeLabel(doc.id);
        const isActual = index === readings.length - 1;

        data. push({
          value: co2Value,
          label: timeLabel,
          dataPointColor: getGaugeColor(co2Value),
          dataPointRadius: isActual ? 6 : 4,
          dataPointText: co2Value. toFixed(0), // Show value on point
          textColor: "#444",
          textFontSize: 9,
          textShiftY: -15,
        });
      });

      // Add predicted value from latest document
      const latestDoc = readings[readings. length - 1];
      if (latestDoc?. predicted?. co2 != null) {
        const actualTimestamp = parseInt(latestDoc. id);
        const predictedTimestamp = actualTimestamp + 15 * 60 * 1000;
        const predictedLabel = formatTimeLabel(predictedTimestamp);

        data.push({
          value: latestDoc.predicted. co2,
          label: predictedLabel,
          dataPointColor: "#9B59B6",
          dataPointRadius:  6,
          dataPointText: latestDoc.predicted.co2.toFixed(0),
          textColor: "#444",
          textFontSize: 9,
          textShiftY: -15,
        });
      }

      // ✅ PUT IT HERE - Calculate Y-axis range after building data
      const co2Values = data. map((d) => d.value);
      const minValue = Math.min(...co2Values);
      const maxValue = Math.max(...co2Values);

      const padding = (maxValue - minValue) * 0.1 || 50;
      const yAxisMin = Math.max(0, Math.floor((minValue - padding) / 50) * 50);
      const yAxisMax = Math.ceil((maxValue + padding) / 50) * 50;

      setChartData(data);
      setYAxisConfig({ min: yAxisMin, max: yAxisMax });
    }
  })();
}, []);

  const value =  Math.round(realtimeReading?.co2 ?? 0);
  const tempval = reading?.predicted?.temperature ?? 0;
  const humidval = reading?. predicted?.humidity ?? 0;

  const percentage = (value / totalValue) * 100;

  const gaugeColor = getGaugeColor(value);
  const tempColor = getTempColor(tempval);
  const humidColor = getHumidityColor(humidval);

  // Create styles with dynamic values
  const styles = createStyles(theme, tempColor, humidColor);

  return (
    <View style={styles.container}>
      <AnimatedCircularProgress
        size={300}
        width={60}
        fill={percentage}
        tintColor={gaugeColor}
        backgroundColor={theme.background}
        rotation={270}
        arcSweepAngle={180}
        lineCap="butt"
      >
        {(fill) => (
          <View style={styles.innerContent}>
            <Text style={styles. head}>CO2</Text>
            <Text style={[styles. valueText, { color: gaugeColor }]}>
              {value}
              <Text style={styles. ppm}>ppm</Text>
            </Text>
            
          </View>
        )}
      </AnimatedCircularProgress>
      <View style={styles.relative}>
        <View style={styles.temp}>
          <View style={styles.inditemp}>
            <View style={styles. tempindicator}></View>
            <Text style={styles.temptitle}>Temperature</Text>
            <Text style={styles. tempvalue}>
              {reading?.actual?. temperature != null
                ? `${reading.actual.temperature.toFixed(2)} °C`
                : "…"}
            </Text>
            <Icon
              name="chevron-right"
              size={40}
              color="#444"
              style={styles.tempbutton}
            />
          </View>
          <View style={styles.predicttemp}>
            <Text style={styles.predicttempText}>
              Predicted Temperature in the next 15 mins: {tempval} °C
            </Text>
          </View>
        </View>
        <View style={styles.humid}>
          <View style={styles.indihumid}>
            <View style={styles.humidindicator}></View>
            <Text style={styles.humidtitle}>Humidity</Text>
            <Text style={styles.humidvalue}>
              {reading?. actual?.humidity != null
                ? `${reading.actual.humidity.toFixed(2)} %`
                : "…"}
            </Text>
            <Icon
              name="chevron-right"
              size={40}
              color="#444"
              style={styles. humidbutton}
            />
          </View>
          <View style={styles.predicthumid}>
            <Text style={styles.predicthumidText}>
              Predicted Humidity in the next 15 mins:  {humidval} %
            </Text>
          </View>
        </View>
      </View>

      <View style={styles.chartContainer}>
        {chartData.length > 0 ?  (
          <LineChart
            data={chartData}
            width={chartWidth}
            height={180}
            color="#177AD5"
            thickness={1}
            curved={false}
            yAxisLabelWidth={40}
            yAxisTextStyle={{ color:  "#444" }}
            xAxisColor="#888"
            yAxisColor="#888"
            xAxisLabelTextStyle={{ color: "#444", fontSize: 10 }}
            yAxisTextNumberOfLines={1}
            textColor="#444"
            hideRules={true}
            noOfSections={5}
            initialSpacing={20}
            endSpacing={20}
            rotateLabel
            yAxisOffset={yAxisConfig.min}
            maxValue={yAxisConfig.max - yAxisConfig.min}  
            xAxisLabelsVerticalShift={8}   
            xAxisLength={chartWidth - 0}  
            xAxisThickness={1}     
          />
        ) : (
          <Text style={{ color: theme.text }}>Loading chart... </Text>
        )}
      </View>
    </View>
  );
};

export default HomeScreen;