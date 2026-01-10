import { StyleSheet, Dimensions } from "react-native";

export const chartWidth = Dimensions.get("window").width * 0.8;

// Factory function to create styles with theme and dynamic colors
export const createStyles = (
  theme: any,
  tempColor: string,
  humidColor: string
) =>
  StyleSheet. create({
    container: {
      flex: 1,
      alignItems: "center",
      paddingTop: 25,
      backgroundColor: theme.background,
    },
    head: {
      color: theme.text,
      fontSize:  25,
      marginTop: -10,
    },
    title: {
      fontSize: 24,
      fontWeight: "bold",
      color: theme.text,
      marginBottom: 30,
    },
    innerContent: {
      alignItems: "center",
      justifyContent: "center",
      marginTop: -50,
    },
    valueText: {
      fontSize: 40,
      fontWeight: "bold",
    },
    ppm: {
      fontSize: 20,
      color: theme.text,
      opacity: 0.5,
    },
    percentText: {
      fontSize: 14,
      color: theme.text,
      marginTop:  8,
    },
    chartContainer: {
      width: "100%",
      alignItems: "center",
      marginLeft: 30,
      marginTop: 20,
    },
    relative: {
      width: "100%",
      height: 100,
      marginTop: -100,
      marginBottom: 20,
    },
    temp: {
      position: "absolute",
      left: 20,
      width: 175,
      height:  100,
      borderRadius: 5,
      borderWidth: 1,
    },
    inditemp: {
      top: 0,
      left:  0,
      width: "100%",
      height: 70,
      borderBottomWidth: 1,
    },
    predicttemp: {
      width: "100%",
      height: 30,
      top: 0,
    },
    tempindicator: {
      top: 10,
      bottom: 10,
      height: "70%",
      width: 6,
      backgroundColor: tempColor,
      position: "absolute",
      borderTopRightRadius: 10,
      borderBottomRightRadius:  10,
    },
    temptitle: {
      position: "absolute",
      top: 10,
      left:  20,
      fontSize:  14,
      color: "black",
      opacity: 0.5,
    },
    tempvalue: {
      position: "absolute",
      bottom: 10,
      left: 20,
      fontSize:  35,
      color: "black",
    },
    tempbutton: {
      position: "absolute",
      top: 20,
      right: 15,
    },
    humid: {
      position: "absolute",
      right: 20,
      width: 175,
      height:  100,
      borderRadius: 5,
      borderWidth: 1,
    },
    indihumid: {
      top: 0,
      left: 0,
      width: "100%",
      height: 70,
      borderBottomWidth: 1,
    },
    predicthumid: {
      width: "100%",
      height: 30,
      top: 0,
    },
    predicttempText: {
      fontSize: 9,
      color: "black",
      opacity: 0.5,
      top: 7,
      left: 5,
      justifyContent: "center",
    },
    humidindicator: {
      top: 10,
      bottom:  10,
      height: "70%",
      width:  6,
      backgroundColor: humidColor,
      position:  "absolute",
      borderTopRightRadius: 10,
      borderBottomRightRadius: 10,
    },
    humidtitle: {
      position: "absolute",
      top: 10,
      left:  20,
      fontSize: 14,
      color: "black",
      opacity: 0.5,
    },
    humidvalue:  {
      position:  "absolute",
      bottom: 10,
      left: 20,
      fontSize: 35,
      color: "black",
    },
    humidbutton: {
      position: "absolute",
      top: 20,
      right:  15,
    },
    predicthumidText: {
      fontSize: 9,
      color:  "black",
      opacity: 0.5,
      top: 7,
      left: 5,
      justifyContent: "center",
    },
  });