import React, { useMemo, useState } from 'react';
import {
  ScrollView,
  View,
  Text,
  StyleSheet,
  Pressable,
  Switch,
  useColorScheme,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { Colors } from '../constants/theme';
import { router } from 'expo-router';

type RowProps = {
  icon: keyof typeof Ionicons.glyphMap;
  label: string;
  value?: string;
  onPress?: () => void;
  rightSlot?: React.ReactNode;
  disabled?: boolean;
};

const Row = ({ icon, label, value, onPress, rightSlot, disabled }: RowProps) => (
  <Pressable
    onPress={onPress}
    disabled={disabled || !onPress}
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
      {rightSlot}
      {onPress ? <Ionicons name="chevron-forward" size={18} color="#999" /> : null}
    </View>
  </Pressable>
);

export default function Settings() {
  const [notificationsOn, setNotificationsOn] = useState(false);
  const scheme = useColorScheme();
  const theme = Colors[scheme || 'light'];

  const themed = useMemo(
    () =>
      StyleSheet.create({
        screen: { flex: 1, backgroundColor: theme.background },
        section: { marginTop: 16, backgroundColor: theme.background },
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

  // bind theme-dependent styles
  styles.rowLabel = themed.rowLabel;
  styles.valueText = themed.valueText;
  styles.rowIconColor = { color: theme.text };

  return (
    <ScrollView style={themed.screen} contentInsetAdjustmentBehavior="automatic">
      {/* Account */}
      <View style={themed.section}>
        <Text style={themed.sectionHeader}>Account</Text>
        <Row
          icon="person-circle-outline"
          label="Profile"
          onPress={() => {
            router.push('/set/profile');
          }}
        />
        <Row
          icon="mail-outline"
          label="Email"
          value="jljuanitas@usa.edu.ph"
          disabled
        />
      </View>

      {/* Preferences */}
      <View style={themed.section}>
        <Text style={themed.sectionHeader}>Preferences</Text>
        <Row
          icon="notifications-outline"
          label="Notifications"
          rightSlot={
            <Switch
              value={notificationsOn}
              onValueChange={setNotificationsOn}
              style={{ marginLeft: 8 }}
            />
          }
        />
      </View>

      {/* Support */}
      <View style={[themed.section, { marginBottom: 32 }]}>
        <Text style={themed.sectionHeader}>Support</Text>
        <Row
          icon="help-buoy-outline"
          label="Help & Support"
          onPress={() => router.push('/help')}
        />
        <Row
          icon="link-outline"
          label="Terms of Service"
          onPress={() => router.push('/settings/terms-of-service')}
        />
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