import React, { useState } from 'react';
import {
  View,
  Text,
  ScrollView,
  StyleSheet,
  TouchableOpacity,
  TextInput,
  Modal,
  Platform,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import DateTimePicker from '@react-native-community/datetimepicker';

export default function EventsScreen() {
  const [showDatePicker, setShowDatePicker] = useState(false);
  const [selectedDate, setSelectedDate] = useState<Date | null>(null);
  const [showForm, setShowForm] = useState(false);
  const [formData, setFormData] = useState({
    title: '',
    time: '',
    location: '',
  });

  const [upcomingEvents, setUpcomingEvents] = useState([
    {
      id: 1,
      title: 'Youth Worship Night',
      date: 'Friday, July 26',
      time: '6:00 PM',
      location: 'Main Sanctuary',
    },
    {
      id: 2,
      title: 'Bible Study Meetup',
      date: 'Wednesday, July 31',
      time: '5:00 PM',
      location: 'Youth Hall',
    },
  ]);

  const handleDateChange = (_event: any, selected: Date | undefined) => {
    setShowDatePicker(false); // Close picker
    if (selected) {
      setSelectedDate(selected);
      setShowForm(true); // Show form only if date is picked
    }
  };

  const handleAddEvent = () => {
    if (!selectedDate || !formData.title || !formData.time || !formData.location) return;

    const newEvent = {
      id: upcomingEvents.length + 1,
      title: formData.title,
      date: selectedDate.toDateString(),
      time: formData.time,
      location: formData.location,
    };

    setUpcomingEvents([newEvent, ...upcomingEvents]);
    setShowForm(false);
    setFormData({ title: '', time: '', location: '' });
    setSelectedDate(null);
  };

  return (
    <View style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <Text style={styles.headerText}>Events</Text>
        <View style={{ flexDirection: 'row', alignItems: 'center' }}>
          <Ionicons name="calendar-outline" size={24} color="#000" />
          <TouchableOpacity
            onPress={() => {
              setShowDatePicker(true);
              setShowForm(false);
            }}
            style={styles.addButton}
          >
            <Ionicons name="add-circle-outline" size={28} color="#1e40af" />
          </TouchableOpacity>
        </View>
      </View>

      <ScrollView showsVerticalScrollIndicator={false}>
        <Text style={styles.sectionTitle}>Upcoming Events</Text>
        {upcomingEvents.map((event) => (
          <View key={event.id} style={styles.eventCard}>
            <Text style={styles.eventTitle}>{event.title}</Text>
            <Text style={styles.eventDetail}>{event.date} · {event.time}</Text>
            <Text style={styles.eventLocation}>{event.location}</Text>
          </View>
        ))}

        <TouchableOpacity style={styles.moreLink}>
          <Text style={styles.moreLinkText}>See all upcoming events →</Text>
        </TouchableOpacity>
      </ScrollView>

      <TouchableOpacity style={styles.reelsButton}>
        <Ionicons name="videocam-outline" size={24} color="#fff" />
        <Text style={styles.reelsButtonText}>Watch Reels</Text>
      </TouchableOpacity>

      {/* Date Picker */}
      {showDatePicker && (
        <DateTimePicker
          value={new Date()}
          mode="date"
          display="default"
          onChange={handleDateChange}
        />
      )}

      {/* Event Form Modal */}
      <Modal visible={showForm} animationType="slide" transparent>
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <Text style={styles.modalTitle}>
              Add Event for {selectedDate?.toDateString()}
            </Text>

            <TextInput
              placeholder="Event Title"
              value={formData.title}
              onChangeText={(text) => setFormData({ ...formData, title: text })}
              style={styles.input}
            />
            <TextInput
              placeholder="Time (e.g., 5:00 PM)"
              value={formData.time}
              onChangeText={(text) => setFormData({ ...formData, time: text })}
              style={styles.input}
            />
            <TextInput
              placeholder="Location"
              value={formData.location}
              onChangeText={(text) => setFormData({ ...formData, location: text })}
              style={styles.input}
            />

            <TouchableOpacity style={styles.submitBtn} onPress={handleAddEvent}>
              <Text style={styles.submitText}>Add Event</Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={styles.cancelBtn}
              onPress={() => {
                setShowForm(false);
                setFormData({ title: '', time: '', location: '' });
                setSelectedDate(null);
              }}
            >
              <Text style={{ color: '#334155' }}>Cancel</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
    </View>
  );
}


const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f8fafc',
    paddingHorizontal: 16,
    paddingTop: 50,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
  },
  headerText: {
    fontSize: 24,
    fontWeight: 'bold',
  },
  addButton: {
    marginLeft: 8,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '600',
    marginBottom: 12,
    marginTop: 16,
  },
  eventCard: {
    backgroundColor: '#fff',
    padding: 16,
    borderRadius: 12,
    marginBottom: 12,
    shadowColor: '#000',
    shadowOpacity: 0.05,
    shadowOffset: { width: 0, height: 2 },
    elevation: 2,
  },
  eventTitle: {
    fontSize: 16,
    fontWeight: 'bold',
  },
  eventDetail: {
    fontSize: 14,
    color: '#475569',
    marginTop: 4,
  },
  eventLocation: {
    fontSize: 14,
    color: '#94a3b8',
    marginTop: 2,
  },
  moreLink: {
    marginTop: 8,
    alignSelf: 'flex-start',
  },
  moreLinkText: {
    color: '#2563eb',
    fontWeight: '500',
  },
  reelsButton: {
    flexDirection: 'row',
    backgroundColor: '#1e3a8a',
    padding: 12,
    borderRadius: 50,
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 20,
  },
  reelsButtonText: {
    color: '#fff',
    marginLeft: 8,
    fontWeight: '500',
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: '#000000aa',
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalContent: {
    width: '90%',
    backgroundColor: '#fff',
    padding: 20,
    borderRadius: 16,
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: '600',
    marginBottom: 12,
  },
  input: {
    borderWidth: 1,
    borderColor: '#cbd5e1',
    borderRadius: 8,
    padding: 10,
    marginBottom: 10,
  },
  submitBtn: {
    backgroundColor: '#1e40af',
    padding: 12,
    borderRadius: 8,
    alignItems: 'center',
  },
  submitText: {
    color: '#fff',
    fontWeight: 'bold',
  },
  cancelBtn: {
    marginTop: 10,
    alignItems: 'center',
  },
});
