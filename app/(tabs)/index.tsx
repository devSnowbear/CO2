import { StyleSheet, Text, View } from 'react-native'
import React from 'react'
import { AnimatedCircularProgress } from 'react-native-circular-progress'

const HomeScreen = () => {
  const value = 5000
  const totalValue = 6000
  const percentage = (value / totalValue) * 100

  // Determine color based on value
  const getColor = (val) => {
    if (val <= 1000) {
      return '#00ff00' // Green
    } else if (val <= 4999) {
      return '#ffff00' // Yellow
    } else if (val <= 5000) {
      return '#ff0000' // Red
    }
  }

  const gaugeColor = getColor(value)

  return (
    <View style={styles.container}>
    
      <AnimatedCircularProgress
        size={300}
        width={60}
        fill={percentage}
        tintColor={gaugeColor}
        backgroundColor="#ffffffff"
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
    </View>
  )
}

export default HomeScreen

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    paddingTop: 150,
    //justifyContent: 'center',
    backgroundColor: '#000',
  },
  head:{
    color: 'white',
    fontSize: 25,
    marginTop: -10,
  },
  title:  {
    fontSize: 24,
    fontWeight: 'bold',
    color: 'white',
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
    color: 'white',
  },
  percentText: {
    //backgroundColor: 'white',
    fontSize: 14,
    color: 'white',
    marginTop: 8,
  },
  labelText: {
    fontSize: 16,
    color: 'white',
  },
})