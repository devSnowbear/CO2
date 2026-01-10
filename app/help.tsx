import React, { useMemo } from 'react';
import * as Updates from 'expo-updates';
import { Alert } from 'react-native';
import {
  ScrollView,
  View,
  Text,
  StyleSheet,
  Pressable,
  Linking,
  useColorScheme,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { Colors } from '../constants/theme';
import { useRouter } from 'expo-router';
import { router } from 'expo-router';

type ItemProps = {
  icon: keyof typeof Ionicons.glyphMap;
  label: string;
  value?: string;
  onPress?: () => void;
};

const Row = ({ icon, label, value, onPress }: ItemProps) => (
  <Pressable
    onPress={onPress}
    disabled={!onPress}
    style={({ pressed }) => [
      styles.rowBase,
      pressed && onPress ? styles.rowPressed : null,
    ]}
  >
    <View style={styles.rowLeft}>
      <Ionicons name={icon} size={20} color={styles.rowIconColor.color} />
      <Text style={styles.rowLabel}>{label}</Text>
    </View>
    <View style={styles.rowRight}>
      {value ? <Text style={styles.valueText}>{value}</Text> : null}
      {onPress ? <Ionicons name="chevron-forward" size={18} color="#999" /> : null}
    </View>
  </Pressable>
);

export default function Help() {
  const scheme = useColorScheme();
  const theme = Colors[scheme || 'light'];

  const themed = useMemo(
    () =>
      StyleSheet.create({
        screen: {
          flex: 1,
          backgroundColor: theme.background,
        },
        section: {
          marginTop: 16,
          backgroundColor: theme.background,
          // lines removed
        },
        sectionHeader: {
          paddingHorizontal: 16,
          paddingBottom: 6,
          color: theme.icon,
          fontSize: 13,
          textTransform: 'uppercase',
          letterSpacing: 0.5,
        },
        rowLabel: { color: theme.text },
        valueText: { color: theme.icon },
      }),
    [theme]
  );

  // Bind theme-dependent colors for Row
  styles.rowLabel = themed.rowLabel;
  styles.valueText = themed.valueText;
  styles.rowIconColor = { color: theme.text };

  return (
    <ScrollView style={themed.screen} contentInsetAdjustmentBehavior="automatic">
      {/* FAQs */}
      <View style={themed.section}>
        <Text style={themed.sectionHeader}>FAQs</Text>
        <Row icon="help-circle-outline" label="How do I use the app?" onPress={() => router.push('/support/how-to-use-app')} />
        <Row icon="shield-checkmark-outline" label="Privacy & data" onPress={() => router.push('/support/privacy-data')} />
      </View>

      {/* Contact */}
      <View style={themed.section}>
        <Text style={themed.sectionHeader}>Contact</Text>
        <Row
          icon="mail-outline"
          label="Email support"
          value="support@example.com"
          onPress={() => Linking.openURL('mailto:support@example.com')}
        />
      </View>

      {/* Troubleshooting */}
      <View style={themed.section}>
        <Text style={themed.sectionHeader}>Troubleshooting</Text>
        <Row
          icon="refresh-outline"
          label="Restart the app"
          onPress={async () => {
            try {
              if (Updates.reloadAsync) {
                await Updates.reloadAsync();
              } else {
                Alert.alert('Restart', 'Close the app from recent apps and reopen it.');
              }
            } catch (e) {
              Alert.alert('Restart', 'Close the app from recent apps and reopen it.');
            }
          }}
        />
      </View>

      {/* About */}
      <View style={[themed.section, { marginBottom: 32 }]}>
        <Text style={themed.sectionHeader}>About</Text>
        <Row icon="information-circle-outline" label="Version" value="1.0.0" />
        <Row icon="link-outline" label="Terms of Service" onPress={() => router.push('/support/terms-of-service')} />
        <Row icon="lock-closed-outline" label="Privacy Policy" onPress={() => router.push('/support/privacy-policy')} />
      </View>
    </ScrollView>
  );
}

// Base styles; some get themed at runtime
const styles = StyleSheet.create({
  rowBase: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    paddingVertical: 14,
    minHeight: 52,
  },
  rowPressed: {
    backgroundColor: '#00000010',
  },
  rowLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    flexShrink: 1,
  },
  rowRight: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    marginLeft: 12,
  },
  rowLabel: {
    marginLeft: 12,
    color: '#000',
    fontSize: 16,
  },
  valueText: {
    color: '#666',
    fontSize: 14,
  },
  rowIconColor: { color: '#000' },
});