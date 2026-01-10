import React from 'react';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import { Drawer } from 'expo-router/drawer';
import { router } from 'expo-router';
import {
  Pressable,
  Dimensions,
  useColorScheme,
  View,
  Text,
  Image,
  StyleSheet,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { DrawerContentScrollView, DrawerItemList, DrawerItem } from '@react-navigation/drawer';
import { Colors } from '../constants/theme';

const drawerWidth = Math.min(260, Dimensions.get('window').width * 0.45);

function CustomDrawerContent(props: any) {
  const scheme = useColorScheme();
  const theme = Colors[scheme || 'light'];

  const profileUri = 'https://placekitten.com/200/200'; // TODO: replace with real user photo

  return (
    <DrawerContentScrollView
      {...props}
      contentContainerStyle={{ flex: 1, paddingTop: 0, backgroundColor: theme.background }}
    >
      {/* Profile header */}
      <View style={[styles.profileHeader, { borderColor: theme.icon }]}>
        <Image source={{ uri: profileUri }} style={styles.avatar} />
        <View style={{ marginLeft: 12 }}>
          <Text style={[styles.name, { color: theme.text }]}>John Doe</Text>
          <Text style={[styles.subtitle, { color: theme.icon }]}>@johndoe</Text>
        </View>
      </View>

      {/* Render drawer screens */}
      <DrawerItemList {...props} />

      

      {/* Logout pinned to bottom */}
      <View
        style={{
          marginTop: 'auto',
          borderTopWidth: StyleSheet.hairlineWidth,
          borderTopColor: theme.icon,
        }}
      >
        <DrawerItem
          label="Logout"
          labelStyle={{ color: theme.text }}
          icon={({ size }) => (
            <Ionicons name="log-out-outline" size={size} color={theme.text} />
          )}
          onPress={() => {
            // TODO: handle logout
          }}
        />
      </View>
    </DrawerContentScrollView>
  );
}

export default function RootLayout() {
  const scheme = useColorScheme();
  const theme = Colors[scheme || 'light'];

  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
      <Drawer
        drawerContent={(props) => <CustomDrawerContent {...props} />}
        screenOptions={{
          drawerStyle: { width: drawerWidth },
          headerStyle: { backgroundColor: theme.background },
          headerTintColor: theme.text,
          headerTitleStyle: { color: theme.text },
          headerShadowVisible: false,
          headerRight: () => (
            <Pressable onPress={() => {}} style={{ paddingHorizontal: 12 }}>
              <Ionicons name="notifications-outline" size={24} color={theme.text} />
            </Pressable>
          ),
        }}
      >
        <Drawer.Screen name="(tabs)" options={{ title: 'Home' }} />
        <Drawer.Screen name="settings" options={{ title: 'Settings' }} />
        <Drawer.Screen name="help" options={{ title: 'Help & Support' }} />
        <Drawer.Screen
          name="support/privacy-policy"
          options={{
            drawerItemStyle: { display: 'none' },
            headerShown: true,
            title: 'Privacy Policy',
            headerLeft: ({ tintColor }) => (
              <Pressable onPress={() => router.push('/help')} hitSlop={10} style={{ paddingHorizontal: 8 }}>
                <Ionicons name="chevron-back" size={24} color={tintColor || theme.text} />
              </Pressable>
            ),
            headerRight: () => null,
          }}
        />
        <Drawer.Screen
          name="support/how-to-use-app"
          options={{
            drawerItemStyle: { display: 'none' },
            headerShown: true,
            title: 'How to Use the App',
            headerLeft: ({ tintColor }) => (
              <Pressable onPress={() => router.push('/help')} hitSlop={10} style={{ paddingHorizontal: 8 }}>
                <Ionicons name="chevron-back" size={24} color={tintColor || theme.text} />
              </Pressable>
            ),
            headerRight: () => null,
          }}
        />
        <Drawer.Screen
          name="support/privacy-data"
          options={{
            drawerItemStyle: { display: 'none' },
            headerShown: true,
            title: 'Privacy & Data',
            headerLeft: ({ tintColor }) => (
              <Pressable onPress={() => router.push('/help')} hitSlop={10} style={{ paddingHorizontal: 8 }}>
                <Ionicons name="chevron-back" size={24} color={tintColor || theme.text} />
              </Pressable>
            ),
            headerRight: () => null,
          }}
        />
        <Drawer.Screen
          name="support/terms-of-service"
          options={{
            drawerItemStyle: { display: 'none' },
            headerShown: true,
            title: 'Terms of Service',
            headerLeft: ({ tintColor }) => (
              <Pressable onPress={() => router.push('/help')} hitSlop={10} style={{ paddingHorizontal: 8 }}>
                <Ionicons name="chevron-back" size={24} color={tintColor || theme.text} />
              </Pressable>
            ),
            headerRight: () => null,
          }}
        />

        // Settings screens
          <Drawer.Screen
          name="set/profile"
          options={{
            drawerItemStyle: { display: 'none' },
            headerShown: true,
            title: 'Profile',
            headerLeft: ({ tintColor }) => (
              <Pressable onPress={() => router.push('/help')} hitSlop={10} style={{ paddingHorizontal: 8 }}>
                <Ionicons name="chevron-back" size={24} color={tintColor || theme.text} />
              </Pressable>
            ),
            headerRight: () => null,
          }}
        />
        
    </Drawer>
  </GestureHandlerRootView>
);
}

const styles = StyleSheet.create({
  profileHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 16,
    paddingBottom: 12,
    borderBottomWidth: StyleSheet.hairlineWidth,
  },
  avatar: {
    width: 52,
    height: 52,
    borderRadius: 26,
  },
  name: {
    fontSize: 16,
    fontWeight: '600',
  },
  subtitle: {
    fontSize: 13,
  },
});