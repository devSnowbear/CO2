import React, { useState, useMemo } from 'react';
import {
  ScrollView,
  View,
  Text,
  TextInput,
  StyleSheet,
  Pressable,
  Alert,
  useColorScheme,
} from 'react-native';
import { Stack, router } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { Colors } from '../../constants/theme';



export default function Profile() {
  const scheme = useColorScheme();
  const theme = Colors[scheme || 'light'];

  const [name, setName] = useState('John Doe');
  const [email, setEmail] = useState('jljuanitas@usa.edu.ph');
  const [phone, setPhone] = useState('');

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
        },
        label: { fontSize: 14, color: theme.icon, marginBottom: 6 },
        input: {
          borderWidth: StyleSheet.hairlineWidth,
          borderColor: theme.icon,
          borderRadius: 10,
          paddingHorizontal: 12,
          paddingVertical: 10,
          color: theme.text,
          backgroundColor: theme.background,
        },
        section: { marginBottom: 16 },
        button: {
          marginTop: 12,
          backgroundColor:'#2563eb',
          borderRadius: 10,
          paddingVertical: 12,
          alignItems: 'center',
        },
        buttonText: { color: '#fff', fontWeight: '600', fontSize: 16 },
      }),
    [theme]
  );

  const onSave = () => {
    // TODO: call your API to save profile
    Alert.alert('Saved', 'Your profile has been updated.');
  };

  return (
    <>
      <Stack.Screen
        options={{
          title: 'Profile',
          headerLeft: ({ tintColor }) => (
            <Pressable onPress={() => router.push('/settings')} hitSlop={10} style={{ paddingHorizontal: 8 }}>
              <Ionicons name="chevron-back" size={24} color={tintColor || theme.text} />
            </Pressable>
          ),
          headerRight: () => null,
        }}
      />
      <ScrollView style={styles.screen} contentInsetAdjustmentBehavior="automatic">
        <View style={styles.card}>
          <View style={styles.section}>
            <Text style={styles.label}>Full Name</Text>
            <TextInput
              value={name}
              onChangeText={setName}
              placeholder="Your name"
              placeholderTextColor={theme.icon}
              style={styles.input}
            />
          </View>

          <View style={styles.section}>
            <Text style={styles.label}>Email</Text>
            <TextInput
              value={email}
              onChangeText={setEmail}
              keyboardType="email-address"
              autoCapitalize="none"
              placeholder="you@example.com"
              placeholderTextColor={theme.icon}
              style={styles.input}
            />
          </View>

          <View style={styles.section}>
            <Text style={styles.label}>Phone</Text>
            <TextInput
              value={phone}
              onChangeText={setPhone}
              keyboardType="phone-pad"
              placeholder="(optional)"
              placeholderTextColor={theme.icon}
              style={styles.input}
            />
          </View>

          <Pressable style={styles.button} onPress={onSave}>
            <Text style={styles.buttonText}>Save</Text>
          </Pressable>
        </View>
      </ScrollView>
    </>
  );
}