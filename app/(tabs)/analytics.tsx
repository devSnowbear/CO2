import { Text, View, ScrollView, useColorScheme } from 'react-native';
import React, { useEffect, useState } from 'react';
import { LineChart } from 'react-native-gifted-charts';
import { Colors } from '../../constants/theme';
import { fetchChartReadings, formatTimeLabel } from '../../scripts/firestore';
import Icon from 'react-native-vector-icons/Feather';
import { createAnalyticsStyles, chartWidth } from '../../styles/analytics';
import { ref, query, orderByKey, limitToLast, get } from 'firebase/database';
import { rtdb } from '../../scripts/firebase';
import { RealtimeReading } from '../../scripts/rtdb';

const Analytics = () => {
  const scheme = useColorScheme();
  const theme = Colors[scheme || 'light'];
  const styles = createAnalyticsStyles(theme);

  const [realtimeData, setRealtimeData] = useState<any[]>([]);
  const [actualData, setActualData] = useState<any[]>([]);
  const [predictedData, setPredictedData] = useState<any[]>([]);

  const [realtimeYAxis, setRealtimeYAxis] = useState({ min: 0, max: 600 });
  const [comparisonYAxis, setComparisonYAxis] = useState({ min: 0, max: 600 });

  const getGaugeColor = (val: number) => {
    if (val <= 1000) return theme.ok;
    if (val <= 4999) return theme.warning;
    return theme.critical;
  };

  useEffect(() => {
    loadRealtimeChart();
    loadComparisonChart();
  }, []);

  // ===== CHART 1: Realtime from RTDB =====
  const loadRealtimeChart = async () => {
    try {
      const readingsRef = ref(rtdb, 'sensorData');
      const readingsQuery = query(readingsRef, orderByKey(), limitToLast(20));
      const snapshot = await get(readingsQuery);

      if (!snapshot.exists()) return;

      const data = snapshot.val();
      const realtime: any[] = [];

      Object.keys(data).forEach((key) => {
        const reading: RealtimeReading = data[key];
        const co2Value = reading.co2 ?? 0;
        const timestamp = reading.timestamp ? parseInt(reading.timestamp) : parseInt(key);
        const timeLabel = formatTimeLabel(timestamp);

        realtime.push({
          value: co2Value,
          label: timeLabel,
          dataPointColor: getGaugeColor(co2Value),
          dataPointRadius: 4,
          dataPointText: co2Value.toFixed(0),
          textColor: '#444',
          textFontSize: 9,
          textShiftY: -15,
          labelTextStyle: { color: '#666', fontSize: 9 },
        });
      });

      if (realtime.length > 0) {
        const realtimeValues = realtime.map((d) => d.value);
        const rtMin = Math.min(...realtimeValues);
        const rtMax = Math.max(...realtimeValues);
        const rtPadding = (rtMax - rtMin) * 0.1 || 50;
        const rtYMin = Math.max(0, Math.floor((rtMin - rtPadding) / 50) * 50);
        const rtYMax = Math.ceil((rtMax + rtPadding) / 50) * 50;

        setRealtimeData(realtime);
        setRealtimeYAxis({ min: rtYMin, max: rtYMax });
      }
    } catch (error) {
      console.error('Error loading realtime chart:', error);
    }
  };

  // ===== CHART 2: Actual vs Predicted from Firestore =====
  const loadComparisonChart = async () => {
    try {
      const readings = await fetchChartReadings();
      if (!readings || readings.length === 0) return;

      const actual: any[] = [];
      const predicted: any[] = [];
      const allValues: number[] = [];

      readings.forEach((doc) => {
        // Actual line (blue worm 🐛)
        if (doc.actual?.co2 != null) {
          const co2Value = doc.actual.co2;
          const timeLabel = formatTimeLabel(doc.id);
          
          actual.push({
            value: co2Value,
            label: timeLabel,
            dataPointColor: '#177AD5',
            dataPointRadius: 5,
            labelTextStyle: { color: '#666', fontSize: 9 },
          });
          allValues.push(co2Value);
        }

        // Predicted line (purple worm 🐛)
        if (doc.predicted?.co2 != null) {
          const co2Value = doc.predicted.co2;
          const timeLabel = formatTimeLabel(doc.predicted.timestamp);
          
          predicted.push({
            value: co2Value,
            label: timeLabel,
            dataPointColor: '#9B59B6',
            dataPointRadius: 5,
            labelTextStyle: { color: '#666', fontSize: 9 },
          });
          allValues.push(co2Value);
        }
      });

      if (allValues.length > 0) {
        const cMin = Math.min(...allValues);
        const cMax = Math.max(...allValues);
        const cPadding = (cMax - cMin) * 0.1 || 50;
        const cYMin = Math.max(0, Math.floor((cMin - cPadding) / 50) * 50);
        const cYMax = Math.ceil((cMax + cPadding) / 50) * 50;

        setActualData(actual);
        setPredictedData(predicted);
        setComparisonYAxis({ min: cYMin, max: cYMax });
      }
    } catch (error) {
      console.error('Error loading comparison chart:', error);
    }
  };

  const renderRealtimeChart = () => {
    return (
      <View style={styles.chartContainer}>
        <View style={styles.chartHeader}>
          <Icon name="activity" size={20} color="#177AD5" />
          <View style={styles.chartTitleContainer}>
            <Text style={styles.chartTitle}>Realtime CO₂ Readings</Text>
            <Text style={styles.chartSubtitle}>Live data from sensor (RTDB)</Text>
          </View>
        </View>

        {realtimeData.length > 0 ? (
          <LineChart
            data={realtimeData}
            width={chartWidth - 120}
            height={200}
            color="#177AD5"
            thickness={2}
            curved={true}
            yAxisLabelWidth={35}
            yAxisTextStyle={{ color: '#666', fontSize: 10 }}
            xAxisColor="#E0E0E0"
            yAxisColor="#E0E0E0"
            xAxisLabelTextStyle={{ color: '#666', fontSize: 9 }}
            yAxisTextNumberOfLines={1}
            textColor="#444"
            hideRules={false}
            rulesColor="#F5F5F5"
            noOfSections={5}
            initialSpacing={20}
            endSpacing={20}
            rotateLabel
            yAxisOffset={realtimeYAxis.min}
            maxValue={realtimeYAxis.max - realtimeYAxis.min}
            xAxisLabelsVerticalShift={8}
            xAxisLabelsHeight={35}
            xAxisThickness={1}
            yAxisThickness={1}
            areaChart={true}
            startFillColor="#177AD5"
            startOpacity={0.2}
            endOpacity={0.05}
            scrollToEnd={true}
            scrollAnimation={true}
          />
        ) : (
          <Text style={{ color: theme.text, textAlign: 'center', marginTop: 20 }}>
            Loading data...
          </Text>
        )}
      </View>
    );
  };

  const renderComparisonChart = () => {
    return (
      <View style={styles.chartContainer}>
        <View style={styles.chartHeader}>
          <Icon name="trending-up" size={20} color="#9B59B6" />
          <View style={styles.chartTitleContainer}>
            <Text style={styles.chartTitle}>Actual vs Predicted CO₂</Text>
            <Text style={styles.chartSubtitle}>Comparison (Firestore)</Text>
          </View>
        </View>

        {/* Legend */}
        <View style={{ flexDirection: 'row', marginBottom: 10, justifyContent: 'center' }}>
          <View style={{ flexDirection: 'row', alignItems: 'center', marginRight: 20 }}>
            <View style={{ width: 12, height: 12, borderRadius: 6, backgroundColor: '#177AD5', marginRight: 6 }} />
            <Text style={{ color: theme.text, fontSize: 12 }}>Actual</Text>
          </View>
          <View style={{ flexDirection: 'row', alignItems: 'center' }}>
            <View style={{ width: 12, height: 12, borderRadius: 6, backgroundColor: '#9B59B6', marginRight: 6 }} />
            <Text style={{ color: theme.text, fontSize: 12 }}>Predicted</Text>
          </View>
        </View>

        {actualData.length > 0 && predictedData.length > 0 ? (
          <LineChart
            data={actualData}
            data2={predictedData}
            width={chartWidth - 120}
            height={200}
            color1="#177AD5"
            color2="#9B59B6"
            thickness={2}
            curved={true}
            yAxisLabelWidth={35}
            yAxisTextStyle={{ color: '#666', fontSize: 10 }}
            xAxisColor="#E0E0E0"
            yAxisColor="#E0E0E0"
            xAxisLabelTextStyle={{ color: '#666', fontSize: 9 }}
            yAxisTextNumberOfLines={1}
            textColor="#444"
            hideRules={false}
            rulesColor="#F5F5F5"
            noOfSections={5}
            initialSpacing={20}
            endSpacing={20}
            rotateLabel
            yAxisOffset={comparisonYAxis.min}
            maxValue={comparisonYAxis.max - comparisonYAxis.min}
            xAxisLabelsVerticalShift={8}
            xAxisLabelsHeight={35}
            xAxisThickness={1}
            yAxisThickness={1}
            scrollToEnd={true}
            scrollAnimation={true}
            
            // Tooltip on press
            showDataPointOnPress
            stripBehindDataPoint
            stripColor="#E0E0E0"
            stripWidth={1}
            
            customDataPoint={(item: any) => {
              return (
                <View style={{
                  width: 10,
                  height: 10,
                  borderRadius: 5,
                  backgroundColor: item.dataPointColor || '#177AD5',
                  borderWidth: 2,
                  borderColor: 'white',
                }} />
              );
            }}
            
            pointerConfig={{
    pointerStripUptoDataPoint: true,
    pointerStripColor: '#177AD5',
    pointerStripWidth: 2,
    strokeDashArray: [2, 5],
    pointerColor: '#177AD5',
    radius: 6,
    pointerLabelWidth: 100,
    pointerLabelHeight: 50,
    activatePointersOnLongPress: true,  // ADD THIS LINE
    pointerLabelComponent: (items: any) => {
      return (
        <View style={{
          backgroundColor: theme.cardBackground,
          paddingHorizontal: 10,
          paddingVertical: 8,
          borderRadius: 8,
          borderWidth: 1,
          borderColor: '#E0E0E0',
          shadowColor: '#000',
          shadowOffset: { width: 0, height: 2 },
          shadowOpacity: 0.15,
          shadowRadius: 4,
          elevation: 4,
        }}>
          <Text style={{ fontSize: 11, color: '#177AD5', fontWeight: '600' }}>
            Actual: {items[0].value.toFixed(1)} ppm
          </Text>
          {items[1] && (
            <Text style={{ fontSize: 11, color: '#9B59B6', fontWeight: '600', marginTop: 3 }}>
              Predicted: {items[1].value.toFixed(1)} ppm
            </Text>
          )}
        </View>
      );
    },
  }}
          />
        ) : (
          <Text style={{ color: theme.text, textAlign: 'center', marginTop: 20 }}>
            Loading data...
          </Text>
        )}
      </View>
    );
  };

  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.scrollContent}>
      <Text style={styles.pageTitle}>Analytics Dashboard</Text>

      {/* Chart 1: Realtime from RTDB */}
      {renderRealtimeChart()}

      {/* Chart 2: Actual vs Predicted (2 lines!) */}
      {renderComparisonChart()}

      

    </ScrollView>
  );
};

export default Analytics;