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
      // alignItems: "center",
      // paddingTop: 25,
      backgroundColor: theme.background,
    },
    scrollContent: {
      alignItems: 'center',
      paddingTop: 25,
      paddingBottom: 120, // ADD THIS
    },
    logoContainer: {
      width: '100%',
      alignItems: 'flex-start',
      paddingTop: 20,
      paddingBottom: 10,
      backgroundColor: theme.background,
      left: 10
    },
    logo: {
      width: 120,
      height: 60,
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
    width: "90%",
    padding: 20,
    backgroundColor:  theme.cardBackground,
    borderRadius: 15,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 3,
    marginTop: 20,
  },

  chartHeader: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      alignItems: 'flex-start',
      marginBottom: 15,
    },
    chartTitle: {
      fontSize: 18,
      fontWeight: '600',
      color: theme.text,
      marginBottom: 4,
    },
    chartSubtitle: {
      fontSize: 12,
      color: '#888',
      fontWeight: '400',
    },
    chartLegend: {
      gap: 8,
    },
    legendItem: {
      flexDirection: 'row',
      alignItems: 'center',
      gap: 6,
    },
    legendDot: {
      width: 8,
      height: 8,
      borderRadius: 4,
    },
    legendText: {
      fontSize: 11,
      color: '#666',
    },
    relative: {
      width: "100%",
      height: 100,
      marginTop: -100,
      marginBottom: -20,
    },
    temp: {
      position: "absolute",
      left: 20,
      width: 175,
      height: 70,
      borderRadius: 10,
      backgroundColor: theme.cardBackground,
      shadowColor: "#000",
      shadowOffset: { width: 0, height: 2 },
      shadowOpacity: 0.1,
      shadowRadius: 8,
      elevation: 3, 
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
      color: theme.text,
      opacity: 0.5,
    },
    tempvalue: {
      position: "absolute",
      bottom: 10,
      left: 20,
      fontSize:  35,
      color: theme.text,
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
      height: 70,
      borderRadius: 10, 
      backgroundColor: theme.cardBackground,  
      shadowColor: "#000",
      shadowOffset: { width: 0, height: 2 },
      shadowOpacity: 0.1,
      shadowRadius: 8,
      elevation: 3, 
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
      color: theme.text,
      opacity: 0.5,
    },
    humidvalue:  {
      position:  "absolute",
      bottom: 10,
      left: 20,
      fontSize: 35,
      color: theme.text,
    },
    humidbutton: {
      position: "absolute",
      top: 20,
      right:  15,
    },
    gaugeContainer: {
      width: '90%',
      alignItems: 'center',
      marginBottom: 80,
    },
    gaugeRow: {
      flexDirection: 'row',
      alignItems: 'center',  // This centers vertically
      justifyContent: 'space-between',
      width: '100%',
    },
    gaugeWrapper: {
      alignItems: 'center',
    },
    gaugeInnerContent: {
      position: 'absolute',
      bottom: 35,  // Increased to move text up above the line
      alignItems: 'center',
    },
    gaugeValue: {
      fontSize: 30,
      fontWeight: '700',
      letterSpacing: -1,
    },
    gaugePpm: {
      fontSize: 13,
      color: '#88888888',
      fontWeight: '500',
    },
    gaugeTextContent: {
      alignItems: 'flex-start',
      justifyContent: 'center',  // Center the content vertically
      flex: 1,
      marginLeft: 30,
      marginTop: -50,
    },
    statusLabel: {
      fontSize: 11,
      color: '#888',
      fontWeight: '500',
      letterSpacing: 1,
      textTransform: 'uppercase',
      marginBottom: 8,
    },
    statusBadgeLarge: {
      paddingHorizontal: 16,
      paddingVertical: 8,
      backgroundColor: theme.cardBackground,
      borderRadius: 20,
      marginBottom: 12,
    },
    statusTextLarge: {
      fontSize: 20,
      fontWeight: '700',
    },
    rangeText: {
      fontSize: 13,
      color: '#666',
      marginBottom: 6,
    },
    
infoSection: {
      width: '90%',
      marginTop: 20,
      marginBottom: 120, // Space for tab bar
    },
    infoTitle: {
      fontSize: 22,
      fontWeight: '700',
      color: theme.text,
      marginBottom: 15,
    },
    infoCard: {
      backgroundColor: theme.cardBackground,
      borderRadius: 15,
      padding: 20,
      marginBottom: 15,
      shadowColor: '#000',
      shadowOffset: { width: 0, height: 2 },
      shadowOpacity: 0.1,
      shadowRadius: 8,
      elevation: 3,
    },
    infoCardHeader: {
      flexDirection: 'row',
      alignItems: 'center',
      marginBottom: 10,
    },
    infoCardTitle: {
      fontSize: 16,
      fontWeight: '600',
      color: theme.text,
      marginLeft: 8,
    },
    infoCardText: {
      fontSize: 14,
      color: theme.text,
      lineHeight: 22,
      opacity: 0.8,
    },
    boldText: {
      fontWeight: '700',
      color: theme.focused,
    },
    guidelineRow: {
      flexDirection: 'row',
      alignItems: 'center',
      marginBottom: 12,
    },
    guidelineDot: {
      width: 12,
      height: 12,
      borderRadius: 6,
      marginRight: 12,
    },
    guidelineTextContainer: {
      flex: 1,
    },
    guidelineTitle: {
      fontSize: 14,
      fontWeight: '600',
      color: theme.text,
      marginBottom: 2,
    },
    guidelineDesc: {
      fontSize: 13,
      color: theme.text,
      opacity: 0.7,
    },
    
  });

  