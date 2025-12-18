import { Tabs } from 'expo-router';
import React, { use } from 'react';
import { View, Text, Dimensions, useColorScheme } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { Colors } from '../../constants/theme';
const { width, height } = Dimensions.get('window');


export default function TabLayout() {

  const scheme = useColorScheme();
  const theme = Colors[scheme || 'light'];

  return (
    <Tabs screenOptions={{ 
      headerShown: false, 
      tabBarShowLabel: false, 
      tabBarStyle: { 
        position: 'absolute', 
        bottom: 50, 
        marginHorizontal: width * 0.08, // 8% margin on each side
        height: 72, 
        elevation: 0, 
        backgroundColor: theme.background, 
        borderRadius:  50, 
        borderWidth: 1,
        alignItems: 'center', 
        justifyContent: 'center',
        width: (width * 0.84) } 
        }}>
          <Tabs.Screen 
          name="index" 
          options={{ 
            tabBarIcon: ({ focused }) => (
              <View style={{ 
                alignItems: 'center', 
                paddingTop: 16,
                width: width/5 }}>
                <Ionicons
                  name={focused ? 'home' : 'home-outline'}
                  color={focused ? theme.focused : '#687076'}
                  size={24}
                />
                <Text style={{ color: focused ? theme.focused : '#687076', fontSize: 12 }}>Home</Text>
              </View>
            ),
          }}
        />
        <Tabs.Screen 
          name="analytics" 
          options={{ 
            tabBarIcon: ({ focused }) => (
              <View style={{ 
                alignItems: 'center', 
                paddingTop: 16,
                width: width/5 }}>
                <Ionicons
                  name={focused ? 'analytics' : 'analytics-outline'}
                  color={focused ? theme.focused : '#687076'}
                  size={24}
                />
                <Text style={{ color: focused ? theme.focused : '#687076', fontSize: 12 }}>Analytics</Text>
              </View>
            ),
          }}
        />
    </Tabs>
  );
}
