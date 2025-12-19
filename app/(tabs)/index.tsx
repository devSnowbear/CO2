import { StyleSheet, Text, useColorScheme, View, Dimensions } from 'react-native'
import React from 'react'
import { AnimatedCircularProgress } from 'react-native-circular-progress'
import { Colors } from '../../constants/theme'
import { LineChart } from "react-native-gifted-charts"
import Icon from 'react-native-vector-icons/Feather'

const HomeScreen = () => {
  const scheme  = useColorScheme()
  const theme = Colors[scheme || 'light']

  const chartWidth = Dimensions.get('window').width * 0.8 // 60% of screen
  
  const tempval = 35
  const humidval = 75
  const value = 900
  const totalValue = 6000
  const percentage = (value / totalValue) * 100

  // Determine color based on value
  const getGaugeColor = (val) => {
    if (val <= 1000) return theme.ok;          // ok
    if (val <= 4999) return theme.warning;          // warning-ish
    return theme.critical;                           // critical
  };
  // Temperature (°C)
  const getTempColor = (t) => {
    if (t < 23) return theme.cool;       // Blue: malamig
    if (t < 30) return theme.ok;         // Green: comfortable
    if (t < 35) return theme.warning;    // Yellow: mainit
    return theme.critical;               // Red: sobrang init
  };

  // Humidity (RH %)
  const getHumidityColor = (h) => {
    if (h < 40) return theme.cool;       // Blue: dry air
    if (h < 70) return theme.ok;         // Green: typical
    if (h < 80) return theme.warning;    // Yellow: very humid
    return theme.critical;               // Red: extreme
  };

  const gaugeColor = getGaugeColor(value);
  const tempColor = getTempColor(tempval);
  const humidColor = getHumidityColor(humidval);

  const data = [
  { value: 150,  label: '6 PM', dataPointColor: getGaugeColor(150)},
  { value: 3000, label: '7 PM', dataPointColor: getGaugeColor(3000) },
  { value: 2600, label: '8 PM', dataPointColor: getGaugeColor(2600) },
  { value: 400,  label: '9 PM', dataPointColor: getGaugeColor(400) },
  { value: 1500, label: '6 PM', dataPointColor: getGaugeColor(1500) },
  { value: 3450, label: '7 PM', dataPointColor: getGaugeColor(3450) },
  { value: 246,  label: '8 PM', dataPointColor: getGaugeColor(246) },
  { value: 500,  label: '9 PM', dataPointColor: getGaugeColor(500) },
  { value: 1587, label: '6 PM', dataPointColor: getGaugeColor(1587) },
  { value: 305,  label: '7 PM', dataPointColor: getGaugeColor(305) },
  { value: 2645, label: '8 PM', dataPointColor: getGaugeColor(2645) },
  { value: 6000, label: '9 PM', dataPointColor: getGaugeColor(6000) },
]

  const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    paddingTop: 25,
    backgroundColor: theme.background,
  },
  head:{
    color: theme.text,
    fontSize: 25,
    marginTop: -10,
  },
  title:  {
    fontSize: 24,
    fontWeight: 'bold',
    color: theme.text,
    marginBottom: 30,
  },
  innerContent: {
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: -50,
  },
  valueText: {
    fontSize: 40,
    fontWeight: 'bold',
  },
  ppm: {
    fontSize: 20,
    color: theme.text,
    opacity: 0.5,
  },
  percentText: {
    //backgroundColor: 'white',
    fontSize: 14,
    color: theme.text,
    marginTop: 8,
  },
  chartContainer: { 
    width: '100%' ,
    alignItems: 'center',
    marginLeft: 30
  },
  relative: {
    width: '100%',
    height: 100,
    //backgroundColor: 'red',
    marginTop: -100,
    marginBottom: 20,
  },
  temp: {
    position: 'absolute',
    left: 20,
    width: 175,
    height: 100,
    borderRadius: 5,
    borderWidth: 1,
  },

  inditemp: { 
    top: 0,
    left: 0,
    width: '100%',
    height: 70,
    borderBottomWidth: 1,
  },
  predicttemp: {
    width: '100%',
    height: 30,
    top: 0,
  },
  tempindicator: {
    top: 10,
    bottom: 10,
    height: '70%',
    width: 6,
    backgroundColor: tempColor,
    position: 'absolute',
    borderTopRightRadius: 10,
    borderBottomRightRadius: 10,
  },
  temptitle: {
    position: 'absolute',
    top: 10,
    left: 20,
    fontSize: 14,
    color: 'black',
    opacity: 0.5
  },
  tempvalue: {
    position: 'absolute',
    bottom: 10,
    left: 20,
    fontSize: 35,
    color: 'black',
  },
  tempbutton: {
    position: 'absolute',
    top: 20,
    right: 15, 
  },
  humid: {
    position: 'absolute',
    right: 20,
    width: 175,
    height: 100,
    //backgroundColor: 'green',
    borderRadius: 5,
    borderWidth: 1,
  },
  indihumid: { 
    top: 0,
    left: 0,
    width: '100%',
    height: 70,
    borderBottomWidth: 1,
  },
  predicthumid: {
    width: '100%',
    height: 30,
    top: 0,
  },
  predicttempText: {
    fontSize: 9,
    color: 'black',
    opacity: 0.5,
    top:7,
    left: 5,
    justifyContent: 'center',
  },
  humidindicator: {
    top: 10,
    bottom: 10,
    height: '70%',
    width: 6,
    backgroundColor: humidColor,
    position: 'absolute',
    borderTopRightRadius: 10,
    borderBottomRightRadius: 10,
  },
  humidtitle: {
    position: 'absolute',
    top: 10,
    left: 20,
    fontSize: 14,
    color: 'black',
    opacity: 0.5
  },
  humidvalue: {
    position: 'absolute',
    bottom: 10,
    left: 20,
    fontSize: 35,
    color: 'black',
  },
  humidbutton: {
    position: 'absolute',
    top: 20,
    right: 15, 
  },
  predicthumidText: {
    fontSize: 9,
    color: 'black',
    opacity: 0.5,
    top:7,
    left: 5,
    justifyContent: 'center',
  },
  })
  
  return (
    <View style={styles.container}>
    
      <AnimatedCircularProgress
        size={300}
        width={60}
        fill={percentage}
        tintColor={gaugeColor}
        backgroundColor= {theme.background}
        rotation={270}
        arcSweepAngle={180}
        lineCap="butt"
      >
        {(fill) => (
          <View style={styles.innerContent}>
            <Text style={styles.head}>CO2</Text>
            <Text style={[styles.valueText, { color: gaugeColor }]}>
              {value}
              <Text style={styles.ppm}>ppm</Text>
            </Text>
            <Text style={styles.percentText}>Predicted CO2 at 10pm: 520ppm</Text>
            
          </View>
        )}
      </AnimatedCircularProgress>
        <View style={styles.relative}>
          <View style={styles.temp}>
              <View style={styles.inditemp}>
                <View style={styles.tempindicator}></View>
                <Text style={styles.temptitle}>Temperature</Text>
                <Text style={styles.tempvalue}>{tempval} °C</Text>
                <Icon name="chevron-right" size={40} color="#444" style={styles.tempbutton} />
              </View>
              <View style={styles.predicttemp}>
                <Text style={styles.predicttempText}>Predicted Temperature in the next 15 mins: {tempval} °C</Text>
              </View>
          </View>
          <View style={styles.humid}>
              <View style={styles.indihumid}>
                <View style={styles.humidindicator}></View>
                <Text style={styles.humidtitle}>Humidity</Text>
                <Text style={styles.humidvalue}>{humidval} %</Text>
                <Icon name="chevron-right" size={40} color="#444" style={styles.humidbutton} />
              </View>
              <View style={styles.predicthumid}>
                <Text style={styles.predicthumidText}>Predicted Humidity in the next 15 mins: {humidval} %</Text>
              </View>

          </View>
        </View>

      <View style={styles.chartContainer}>
        <LineChart
        data={data}
        width={chartWidth}
        height={180}
        color="#177AD5"
        thickness={1}
        curved={false}
        yAxisLabelWidth={32}              // space for ppm labels on left
        yAxisTextStyle={{ color: '#444' }} // ppm values color
        xAxisColor="#888"
        yAxisColor="#888"
        xAxisLabelTextStyle={{ color: '#444', fontSize: 12 }} // time labels
        yAxisTextNumberOfLines={1}
        showValuesOnTopOfPoints
        textColor="#444" // show data point values
        hideRules={true}                 // show grid lines
        noOfSections={5}                  // grid sections on y-axis
        initialSpacing={20}
        endSpacing={20}
      />
      </View>
      
    </View>
  )
}

export default HomeScreen

