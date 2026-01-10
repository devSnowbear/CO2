import React, { useMemo } from 'react';
import { ScrollView, View, Text, StyleSheet, useColorScheme, Pressable } from 'react-native';
import { Stack, router } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { Colors } from '../../constants/theme';

export default function TermsOfService() {
  const scheme = useColorScheme();
  const theme = Colors[scheme || 'light'];

  const styles = useMemo(
    () =>
      StyleSheet.create({
        screen: { flex: 1, backgroundColor: theme.background, padding: 16 },
        card: {
          backgroundColor: theme.surface || theme.background,
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
          title: 'Terms of Service',
          headerBackTitleVisible: false,
          headerLeft: ({ tintColor }) => (
            <Pressable onPress={() => router.push('/help')} hitSlop={10} style={{ paddingHorizontal: 8 }}>
              <Ionicons name="chevron-back" size={24} color={tintColor || theme.text} />
            </Pressable>
          ),
          headerRight: () => null, // hide bell if needed
        }}
      />
      <ScrollView style={styles.screen} contentInsetAdjustmentBehavior="automatic">
        <View style={styles.card}>
          <Text style={styles.title}>Terms of Service</Text>
          <Text style={styles.body}>Last updated: 2025-01-01</Text>

          <Text style={styles.subtitle}>1. Acceptance</Text>
          <Text style={styles.body}>By using the app, you agree to these Terms.</Text>

          <Text style={styles.subtitle}>2. Use of the Service</Text>
          <Text style={styles.bullet}>• Don’t misuse the app or disrupt others’ use.</Text>
          <Text style={styles.bullet}>• Keep your account secure; you’re responsible for activity.</Text>

          <Text style={styles.subtitle}>3. Content</Text>
          <Text style={styles.bullet}>• You retain your content; you grant us a license to operate the service.</Text>
          <Text style={styles.bullet}>• Don’t post unlawful or infringing content.</Text>

          <Text style={styles.subtitle}>4. Privacy</Text>
          <Text style={styles.body}>See our Privacy Policy for how we handle data.</Text>

          <Text style={styles.subtitle}>5. Disclaimers & Liability</Text>
          <Text style={styles.bullet}>• Service is provided “as is”; warranties are disclaimed as allowed by law.</Text>
          <Text style={styles.bullet}>• Liability is limited to the maximum extent permitted.</Text>

          <Text style={styles.subtitle}>6. Termination</Text>
          <Text style={styles.body}>We may suspend or terminate accounts for violations.</Text>

          <Text style={styles.subtitle}>7. Changes</Text>
          <Text style={styles.body}>We may update Terms; continued use means acceptance.</Text>

          <Text style={styles.subtitle}>8. Contact</Text>
          <Text style={styles.body}>Email: support@example.com</Text>
        </View>
      </ScrollView>
    </>
  );
}