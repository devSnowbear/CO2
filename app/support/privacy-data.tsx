import React, { useMemo } from 'react';
import { ScrollView, View, Text, StyleSheet, useColorScheme } from 'react-native';
import { Stack, router } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { Pressable } from 'react-native';
import { Colors } from '../../constants/theme';

export default function PrivacyData() {
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
    <>
      <Stack.Screen
        options={{
          title: 'Privacy & Data',
          headerLeft: ({ tintColor }) => (
            <Pressable onPress={() => router.push('/help')} hitSlop={10} style={{ paddingHorizontal: 8 }}>
              <Ionicons name="chevron-back" size={24} color={tintColor || theme.text} />
            </Pressable>
          ),
          headerRight: () => null, // hide the bell on this screen
        }}
      />
      <ScrollView style={styles.screen} contentInsetAdjustmentBehavior="automatic">
        <View style={styles.card}>
          <Text style={styles.title}>Privacy & Data</Text>
          <Text style={styles.body}>
            We explain what data we collect, how we use it, and the choices you have.
          </Text>

          <Text style={styles.subtitle}>What we collect</Text>
          <Text style={styles.bullet}>• Account info: name, email, and profile details you provide.</Text>
          <Text style={styles.bullet}>• Usage data: app interactions, device info, diagnostics, crash logs.</Text>
          <Text style={styles.bullet}>• Optional data: feedback you submit, attachments you upload.</Text>

          <Text style={styles.subtitle}>How we use it</Text>
          <Text style={styles.bullet}>• To provide and improve the app experience.</Text>
          <Text style={styles.bullet}>• To communicate with you about support and updates.</Text>
          <Text style={styles.bullet}>• To secure the service and prevent fraud.</Text>
          <Text style={styles.bullet}>• For analytics to understand feature usage.</Text>

          <Text style={styles.subtitle}>Sharing</Text>
          <Text style={styles.bullet}>• Service providers (hosting, analytics, support) under confidentiality.</Text>
          <Text style={styles.bullet}>• Legal/safety needs (comply with law, protect rights and users).</Text>
          <Text style={styles.bullet}>• Business transfers (merger, acquisition); we do not sell personal data.</Text>

          <Text style={styles.subtitle}>Retention</Text>
          <Text style={styles.bullet}>• We keep data as long as needed for the service and legal purposes.</Text>
          <Text style={styles.bullet}>• When no longer needed, we delete or anonymize it.</Text>

          <Text style={styles.subtitle}>Your choices</Text>
          <Text style={styles.bullet}>• Update or delete your account info (in settings or via support).</Text>
          <Text style={styles.bullet}>• Manage notifications/analytics in app or device settings.</Text>
          <Text style={styles.bullet}>• Request access, correction, deletion, or a copy of your data where applicable.</Text>

          <Text style={styles.subtitle}>Security</Text>
          <Text style={styles.bullet}>• We use reasonable safeguards, but no method is 100% secure.</Text>

          <Text style={styles.subtitle}>Contact</Text>
          <Text style={styles.bullet}>• Email: support@example.com</Text>
          <Text style={styles.bullet}>• Address: [Your company address]</Text>
        </View>
      </ScrollView>
    </>
  );
}