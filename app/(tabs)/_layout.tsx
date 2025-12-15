import { Tabs } from 'expo-router';
import React from 'react';
import { View, Text, Dimensions } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
const { width, height } = Dimensions.get('window');

export default function TabLayout() {

  return (
    <Tabs screenOptions={{ 
      headerShown: false, 
      tabBarShowLabel: false, 
      tabBarStyle: { 
        position: 'absolute', 
        bottom: 27, 
        marginHorizontal: width * 0.08, // 8% margin on each side
        height: 72, 
        elevation: 0, 
        backgroundColor: "white", 
        borderRadius:  50, 
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
                paddingTop: 15,
                width: width/5 }}>
                <Ionicons
                  name={focused ? 'home' : 'home-outline'}
                  color={focused ? '#2375a5ff' : '#687076'}
                  size={24}
                />
                <Text style={{ color: focused ? '#2375a5ff' : '#687076', fontSize: 12 }}>Home</Text>
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
                paddingTop: 15,
                width: width/5 }}>
                <Ionicons
                  name={focused ? 'analytics' : 'analytics-outline'}
                  color={focused ? '#2375a5ff' : '#687076'}
                  size={24}
                />
                <Text style={{ color: focused ? '#2375a5ff' : '#687076', fontSize: 12 }}>Analytics</Text>
              </View>
            ),
          }}
        />
    </Tabs>
  );
}
