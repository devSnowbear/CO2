import { Stack } from 'expo-router';
import { ScrollView, Text, StyleSheet, useColorScheme } from 'react-native';
import React, { useMemo } from 'react';
import { Colors } from '../../constants/theme';

export default function PrivacyPolicy() {
  const scheme = useColorScheme();
  const theme = Colors[scheme || 'light'];

  const styles = useMemo(
    () =>
      StyleSheet.create({
        container: { padding: 16, backgroundColor: theme.background },
        body: { fontSize: 16, lineHeight: 22, color: theme.text },
        heading: { fontSize: 20, fontWeight: '700', color: theme.text, marginTop: 16, marginBottom: 8 },
      }),
    [theme]
  );

  return (
    <>
      <Stack.Screen options={{ title: 'Privacy Policy' }} />
      <ScrollView contentContainerStyle={styles.container}>
        <Text style={styles.body}>
          {`Last updated: 2025-01-01

This Privacy Policy explains how [App/Company Name] ("we", "us", or "our") collects, uses, and shares information when you use our app and services.

What we collect
- Account info: name, email, and other details you provide.
- Usage data: app interactions, device info, diagnostics, and crash logs.
- Optional data: things you choose to share (e.g., feedback, attachments).
- Cookies/Identifiers: tokens or device identifiers for authentication and analytics.

How we use your information
- To provide, maintain, and improve the app.
- To personalize your experience and deliver relevant content.
- To communicate with you (support, updates, security notices).
- To detect, prevent, and address fraud or misuse.
- For analytics and to understand feature usage.

Sharing your information
- Service providers: to help us run the app (hosting, analytics, support).
- Legal/safety: to comply with law, enforce terms, or protect rights/safety.
- Business transfers: if we merge, sell, or transfer assets, your info may transfer as part of the transaction.
- We do not sell your personal information.

Data retention
- We keep data as long as needed to provide the service and for legitimate business or legal purposes. When no longer needed, we delete or anonymize it.

Your choices
- You can update or delete your account info (where available in settings or by contacting us).
- You can disable analytics/notifications where supported by your device or app settings.
- You may request access, correction, deletion, or a copy of your data where applicable by law.

Security
- We use reasonable administrative, technical, and physical safeguards. No method of transmission or storage is 100% secure.

Children
- The service is not directed to children under the age where parental consent is required. Do not use the app if you are under that age.

International transfers
- Your data may be stored and processed in other countries. We take steps to ensure appropriate protections as required by law.

Changes to this policy
- We may update this policy. We will notify you of material changes as required (e.g., in-app notice).

Contact us
- Email: support@example.com
- Address: [Your company address]

By using the app, you agree to this Privacy Policy.`}
        </Text>
      </ScrollView>
    </>
  );
}