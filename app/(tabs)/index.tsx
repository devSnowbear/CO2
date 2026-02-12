import { Text, useColorScheme, View, Image } from "react-native";
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
import { useVoiceAlert } from "../../hooks/useVoiceAlert";
import { registerForPushNotifications } from "../../services/notificationService";

const HomeScreen = () => {
  const scheme = useColorScheme();
  const theme = Colors[scheme || "light"];

  const totalValue = 6000;

  const [reading, setReading] = useState<Reading | null>(null);
const [chartData, setChartData] = useState<any[]>([]);
const [yAxisConfig, setYAxisConfig] = useState({ min: 0, max: 600 });  

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

  useEffect(() => {
    // Request notification permissions
    registerForPushNotifications();
  }, []);

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

      //Calculate Y-axis range after building data
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

  const value = Math.round(realtimeReading?.co2 ?? 0);
const tempval = realtimeReading?.temperature ?? 0;
const humidval = realtimeReading?.humidity ?? 0;

  const percentage = (value / totalValue) * 100;

  const gaugeColor = getGaugeColor(value);
  const tempColor = getTempColor(tempval);
  const humidColor = getHumidityColor(humidval);

  // useVoiceAlert(value, tempval, humidval, {
  //   co2: 100,        // Alert if CO2 > 1000 ppm
  //   temperature: 35,  // Alert if temp > 35°C
  //   humidity: 80,     // Alert if humidity > 80%
  // });

  // Create styles with dynamic values
  const styles = createStyles(theme, tempColor, humidColor);

  return (
    <View style={styles.container}>

      <View style={styles.logoContainer}>
  <Image 
    source={scheme === 'dark' 
      ? require('../../assets/images/darkLogo.png')  // Logo for dark theme
      : require('../../assets/images/lightLogo.png')  // Logo for light theme
    } 
    style={styles.logo}
    resizeMode="contain"
  />
</View>

      <View style={styles.gaugeContainer}>
  <View style={styles.gaugeRow}>
    <View style={styles.gaugeWrapper}>
      <AnimatedCircularProgress
        size={180}
        width={40}
        fill={percentage}
        tintColor={gaugeColor}
        backgroundColor="#F0F0F0"
        rotation={270}
        arcSweepAngle={180}
        lineCap="round"
      >
        {() => (
          <View style={styles.gaugeInnerContent}>
            <Text style={[styles.gaugeValue, { color: gaugeColor }]}>
              {value}
              <Text style={styles.gaugePpm}>  ppm</Text>
            </Text>
            
          </View>
        )}
      </AnimatedCircularProgress>
    </View>
    
    <View style={styles.gaugeTextContent}>
      <Text style={styles.statusLabel}>Realtime CO₂</Text>
      <View style={styles.statusBadgeLarge}>
        <Text style={[styles.statusTextLarge, { color: gaugeColor }]}>
          {value <= 1000 ? 'Good' : value <= 4999 ? 'Moderate' : 'Critical'}
        </Text>
      </View>
      <Text style={styles.rangeText}>
        {value <= 1000 ? 'Safe levels' : value <= 4999 ? 'Ventilation recommended' : 'Action required'}
      </Text>
    </View>
  </View>
</View>
    
      <View style={styles.relative}>
        <View style={styles.temp}>
          <View style={styles.tempindicator}></View>
          <Text style={styles.temptitle}>Temperature</Text>
          <Text style={styles.tempvalue}>
            {realtimeReading?.temperature != null
              ? `${realtimeReading.temperature.toFixed(2)} °C`
              : "…"}
          </Text>
        </View>
        <View style={styles.humid}>
            <View style={styles.humidindicator}></View>
            <Text style={styles.humidtitle}>Humidity</Text>
            <Text style={styles.humidvalue}>
              {realtimeReading?.humidity != null
              ? `${realtimeReading.humidity.toFixed(2)} %`
              : "…"}
            </Text>
        </View>
      </View>
      
      <View style={styles.chartContainer}>
        <View style={styles.chartHeader}>
        <View>
          <Text style={styles.chartTitle}>CO₂ Prediction</Text>
          <Text style={styles.chartSubtitle}>Last 3 hours • Next 15 mins</Text>
        </View>
        <View style={styles.chartLegend}>
          <View style={styles.legendItem}>
            <View style={[styles.legendDot, { backgroundColor: '#14be42' }]}></View>
            <Text style={styles.legendText}>Actual</Text>
          </View>
          <View style={styles.legendItem}>
            <View style={[styles.legendDot, { backgroundColor: '#9B59B6' }]}></View>
            <Text style={styles.legendText}>Predicted</Text>
          </View>
        </View>
      </View>
        {chartData.length > 0 ?  (
          
          <LineChart
            data={chartData}
            width={chartWidth - 40}  // Subtract padding
            height={200}  // Increase height slightly
            color="#177AD5"
            thickness={2}  // Thicker line
            curved={true}  // Enable curves for smoother look
            yAxisLabelWidth={28}
            yAxisTextStyle={{ color: "#666", fontSize: 11 }}
            xAxisColor="#E0E0E0"  // Lighter axis color
            yAxisColor="#E0E0E0"
            xAxisLabelTextStyle={{ color: "#666", fontSize: 10 }}
            yAxisTextNumberOfLines={1}
            textColor="#444"
            hideRules={false}  // Show grid lines
            rulesColor="#F5F5F5"  // Very light grid lines
            noOfSections={5}
            initialSpacing={20}
            endSpacing={20}
            rotateLabel
            yAxisOffset={yAxisConfig.min}
            maxValue={yAxisConfig.max - yAxisConfig.min}
            xAxisLabelsVerticalShift={8}
            xAxisThickness={1}
            yAxisThickness={1}
            areaChart={true}  // Add gradient fill under line
            startFillColor="#177AD5"
            startOpacity={0.2}
            endOpacity={0.05}
          />
        ) : (
          <Text style={{ color: theme.text }}>Loading chart... </Text>
        )}
      </View>

    </View>
  );
};

export default HomeScreen;