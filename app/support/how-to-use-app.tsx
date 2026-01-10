import React, { useMemo } from 'react';
import { ScrollView, View, Text, StyleSheet, useColorScheme } from 'react-native';
import { Colors } from '../../constants/theme'; // adjust path if needed

export default function HowToUseApp() {
  const scheme = useColorScheme();
  const theme = Colors[scheme || 'light'];

  const styles = useMemo(
    () =>
      StyleSheet.create({
        screen: { flex: 1, backgroundColor: theme.background, padding: 16 },
        card: {
          backgroundColor: theme.background,
          borderRadius: 12,
          padding: 16,
          shadowColor: '#000',
          shadowOpacity: 0.08,
          shadowRadius: 6,
          shadowOffset: { width: 0, height: 3 },
          elevation: 2,
          marginBottom: 16,
        },
        title: { fontSize: 20, fontWeight: '700', color: theme.text, marginBottom: 8 },
        subtitle: { fontSize: 16, fontWeight: '600', color: theme.text, marginTop: 12, marginBottom: 6 },
        body: { fontSize: 15, color: theme.text, lineHeight: 22 },
        bullet: { fontSize: 15, color: theme.text, lineHeight: 22, marginLeft: 12 },
      }),
    [theme]
  );

  return (
    <ScrollView style={styles.screen} contentInsetAdjustmentBehavior="automatic">
      <View style={styles.card}>
        <Text style={styles.title}>How do I use the app?</Text>
        <Text style={styles.body}>Follow these steps to get started and make the most of the app.</Text>

        <Text style={styles.subtitle}>1) Set up your account</Text>
        <Text style={styles.bullet}>• Create or sign in with your account.</Text>
        <Text style={styles.bullet}>• Verify your email and update your profile details.</Text>

        <Text style={styles.subtitle}>2) Connect your devices (if applicable)</Text>
        <Text style={styles.bullet}>• Ensure Bluetooth/Wi‑Fi is on.</Text>
        <Text style={styles.bullet}>• Add or pair your device from the Home or Devices section.</Text>

        <Text style={styles.subtitle}>3) Understand the dashboard</Text>
        <Text style={styles.bullet}>• The main metrics show your current status.</Text>
        <Text style={styles.bullet}>• Tap a card or metric to see details or history.</Text>

        <Text style={styles.subtitle}>4) Charts & history</Text>
        <Text style={styles.bullet}>• Use the chart dropdown to switch ranges (Today, Week, Month).</Text>
        <Text style={styles.bullet}>• Tap points or legend items (if enabled) to inspect values.</Text>

        <Text style={styles.subtitle}>5) Notifications</Text>
        <Text style={styles.bullet}>• Enable alerts in Settings to get notified about important changes.</Text>

        <Text style={styles.subtitle}>Tips</Text>
        <Text style={styles.bullet}>• Pull to refresh when viewing live data.</Text>
        <Text style={styles.bullet}>• Check Help & Support for FAQs and troubleshooting.</Text>
      </View>
    </ScrollView>
  );
}