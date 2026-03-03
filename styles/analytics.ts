import { StyleSheet, Dimensions } from 'react-native';

const { width } = Dimensions.get('window');
export const chartWidth = width;

export const createAnalyticsStyles = (theme: any) => {
  return StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: theme.background,
    },
    scrollContent: {
      alignItems: 'center',
      paddingBottom: 120,
      paddingHorizontal: 20, // Add horizontal padding
    },
    pageTitle: {
      fontSize: 28,
      fontWeight: '700',
      color: theme.text,
      marginTop: 60,
      marginBottom: 20,
      width: '100%', // Full width
      paddingHorizontal: 0,
    },
    chartContainer: {
      width: '100%', // Changed from 90% to 100%
      padding: 20,
      backgroundColor: theme.cardBackground,
      borderRadius: 15,
      shadowColor: '#000',
      shadowOffset: { width: 0, height: 2 },
      shadowOpacity: 0.1,
      shadowRadius: 8,
      elevation: 3,
      marginBottom: 20,
    },
    chartHeader: {
      flexDirection: 'row',
      alignItems: 'center',
      marginBottom: 15,
    },
    chartTitleContainer: {
      marginLeft: 8,
    },
    chartTitle: {
      fontSize: 16,
      fontWeight: '600',
      color: theme.text,
    },
    chartSubtitle: {
      fontSize: 12,
      color: '#888',
      marginTop: 2,
    },
  });
};