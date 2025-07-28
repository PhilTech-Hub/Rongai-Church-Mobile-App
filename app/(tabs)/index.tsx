import React from 'react';
import { ScrollView, Text, View, TouchableOpacity} from 'react-native';
import { Ionicons } from '@expo/vector-icons';

export default function HomeScreen() {
  return (
    <ScrollView contentContainerStyle={{ padding: 16 }}>
      {/* 1. Welcome Card */}
      <View
        style={{
          backgroundColor: '#f1f5f9',
          padding: 20,
          borderRadius: 16,
          marginBottom: 16,
        }}
      >
        <Text style={{ fontSize: 22, fontWeight: 'bold', marginBottom: 8 }}>
          Hi Philemon, 🙌
        </Text>
        <Text style={{ fontSize: 16, color: '#475569' }}>
          Welcome back to Youth Connect. Let’s make today count!
        </Text>
      </View>

      {/* 2. Announcements */}
      <Text style={{ fontSize: 18, fontWeight: '600', marginBottom: 8 }}>
        Announcements
      </Text>
      <ScrollView horizontal showsHorizontalScrollIndicator={false}>
        {[1, 2, 3].map((item) => (
          <View
            key={item}
            style={{
              backgroundColor: '#e2e8f0',
              padding: 16,
              borderRadius: 12,
              marginRight: 12,
              width: 250,
            }}
          >
            <Text style={{ fontWeight: 'bold', fontSize: 16 }}>
              Youth Camp Registration
            </Text>
            <Text style={{ color: '#475569', marginTop: 4 }}>
              Register before Aug 1st to reserve your spot. Open to all youths.
            </Text>
          </View>
        ))}
      </ScrollView>

      {/* 3. Quick Actions */}
      <Text style={{ fontSize: 18, fontWeight: '600', marginTop: 24, marginBottom: 8 }}>
        Quick Actions
      </Text>
      <View style={{ flexDirection: 'row', justifyContent: 'space-between' }}>
        {[
          { title: 'Join Prayer', icon: 'hand' },
          { title: 'Meet Room', icon: 'people' },
          { title: 'Library', icon: 'book' },
        ].map((action, i) => (
          <TouchableOpacity
            key={i}
            style={{
              backgroundColor: '#cbd5e1',
              padding: 12,
              borderRadius: 12,
              alignItems: 'center',
              width: '30%',
            }}
          >
            <Ionicons name={action.icon} size={24} color="#1e293b" />
            <Text style={{ marginTop: 8, fontWeight: '500', textAlign: 'center' }}>
              {action.title}
            </Text>
          </TouchableOpacity>
        ))}
      </View>

      {/* 4. Upcoming Events */}
      <Text style={{ fontSize: 18, fontWeight: '600', marginTop: 24, marginBottom: 8 }}>
        Upcoming Events
      </Text>
      {[1, 2].map((event) => (
        <View
          key={event}
          style={{
            backgroundColor: '#f8fafc',
            padding: 16,
            borderRadius: 12,
            marginBottom: 12,
            borderWidth: 1,
            borderColor: '#e2e8f0',
          }}
        >
          <Text style={{ fontWeight: 'bold', fontSize: 16 }}>Youth Worship Night</Text>
          <Text style={{ color: '#64748b' }}>Friday, July 26 · 6:00 PM</Text>
        </View>
      ))}
    </ScrollView>
  );
}
