import React from 'react';
import { ScrollView, Text, View, TouchableOpacity } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native';

export default function HomeScreen() {
  const navigation = useNavigation();

  return (
    <ScrollView contentContainerStyle={{ padding: 16, gap: 24 }}>
      {/* Welcome Note */}
      <View style={{ backgroundColor: '#f1f5f9', padding: 20, borderRadius: 16 }}>
        <Text style={{ fontSize: 22, fontWeight: 'bold', marginBottom: 8 }}>
          Hi Philemon 👋
        </Text>
        <Text style={{ fontSize: 16, color: '#475569' }}>
          Welcome back to Rongai Church Connect!
        </Text>
      </View>

      {/* Announcements */}
      <View>
        <View style={{ flexDirection: 'row', justifyContent: 'space-between', marginBottom: 8 }}>
          <Text style={{ fontSize: 18, fontWeight: '600' }}>Announcements</Text>
          <TouchableOpacity onPress={() => navigation.navigate('Announcements')}>
            <Text style={{ color: '#2563eb' }}>See all</Text>
          </TouchableOpacity>
        </View>

        {[1].map((item) => (
          <View
            key={item}
            style={{
              backgroundColor: '#e2e8f0',
              padding: 16,
              borderRadius: 12,
              marginBottom: 8,
            }}
          >
            <Text style={{ fontWeight: 'bold', fontSize: 16 }}>Youth Camp Registration</Text>
            <Text style={{ color: '#475569', marginTop: 4 }}>
              Register by Aug 1 to reserve your spot.
            </Text>
          </View>
        ))}
      </View>

      {/* Upcoming Events */}
      <View>
        <View style={{ flexDirection: 'row', justifyContent: 'space-between', marginBottom: 8 }}>
          <Text style={{ fontSize: 18, fontWeight: '600' }}>Upcoming Events</Text>
          <TouchableOpacity onPress={() => navigation.navigate('Events')}>
            <Text style={{ color: '#2563eb' }}>See all</Text>
          </TouchableOpacity>
        </View>

        {[1, 2].map((event) => (
          <View
            key={event}
            style={{
              backgroundColor: '#f8fafc',
              padding: 16,
              borderRadius: 12,
              marginBottom: 8,
              borderWidth: 1,
              borderColor: '#e2e8f0',
            }}
          >
            <Text style={{ fontWeight: 'bold', fontSize: 16 }}>Youth Worship Night</Text>
            <Text style={{ color: '#64748b' }}>Friday, July 26 · 6:00 PM</Text>
          </View>
        ))}
      </View>

      {/* Reels Button */}
      <TouchableOpacity
        style={{
          backgroundColor: '#1d4ed8',
          padding: 14,
          borderRadius: 12,
          alignItems: 'center',
        }}
        onPress={() => navigation.navigate('Reels')}
      >
        <Text style={{ color: '#fff', fontWeight: '600' }}>
          🎥 Watch Reels & Highlights
        </Text>
      </TouchableOpacity>
    </ScrollView>
  );
}
