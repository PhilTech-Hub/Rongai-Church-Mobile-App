// app/_layout.tsx or app/_layout.js (based on your project structure)

import React from 'react';
import { Tabs } from 'expo-router';
import { Platform, Image, Text, View } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useColorScheme } from '@/hooks/useColorScheme';
import { Colors } from '@/constants/Colors';
import { HapticTab } from '@/components/HapticTab';
import TabBarBackground from '@/components/ui/TabBarBackground';

export default function TabLayout() {
  const colorScheme = useColorScheme();

  return (
    <Tabs
      screenOptions={({ route }) => ({
        headerShown: true, // Show header globally
        headerTitle: () => (
          <Text style={{ fontSize: 20, fontWeight: 'bold' }}>
            Rongai Church
          </Text>
        ),
        headerRight: () => (
          <Image
            source={{ uri: 'https://i.pravatar.cc/150?img=3' }} // Replace with actual profile image
            style={{
              width: 36,
              height: 36,
              borderRadius: 18, // 50% border radius
              marginRight: 16,
            }}
          />
        ),
        tabBarActiveTintColor: Colors[colorScheme ?? 'light'].tint,
        tabBarButton: HapticTab,
        tabBarBackground: TabBarBackground,
        tabBarStyle: Platform.select({
          ios: {
            position: 'absolute',
          },
          default: {},
        }),
      })}
    >
      <Tabs.Screen
        name="index"
        options={{
          title: 'Home',
          tabBarIcon: ({ color, size }) => (
            <Ionicons name="home" size={size ?? 28} color={color} />
          ),
        }}
      />
      <Tabs.Screen
        name="social"
        options={{
          title: 'Social',
          tabBarIcon: ({ color, size }) => (
            <Ionicons name="people" size={size ?? 28} color={color} />
          ),
        }}
      />
      <Tabs.Screen
        name="event"
        options={{
          title: 'Events',
          tabBarIcon: ({ color, size }) => (
            <Ionicons name="calendar" size={size ?? 28} color={color} />
          ),
        }}
      />
    </Tabs>
  );
}
