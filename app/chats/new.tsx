import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  FlatList,
  TouchableOpacity,
  StyleSheet,
  TextInput,
  Keyboard,
} from 'react-native';
import { useRouter } from 'expo-router';
import * as Contacts from 'expo-contacts';
import { Ionicons, Entypo, Feather } from '@expo/vector-icons';

export default function NewChatScreen() {
  const router = useRouter();
  const [contacts, setContacts] = useState<Contacts.Contact[]>([]);
  const [searchMode, setSearchMode] = useState(false);
  const [searchText, setSearchText] = useState('');

  const [filteredContacts, setFilteredContacts] = useState<Contacts.Contact[]>([]);

  useEffect(() => {
    (async () => {
      const { status } = await Contacts.requestPermissionsAsync();
      if (status === 'granted') {
        const { data } = await Contacts.getContactsAsync({
          fields: [Contacts.Fields.PhoneNumbers],
        });

        if (data.length > 0) {
          setContacts(data);
          setFilteredContacts(data);
        }
      }
    })();
  }, []);

  // Filter contacts as user types
  useEffect(() => {
    if (searchText === '') {
      setFilteredContacts(contacts);
    } else {
      const filtered = contacts.filter((contact) =>
        contact.name?.toLowerCase().includes(searchText.toLowerCase())
      );
      setFilteredContacts(filtered);
    }
  }, [searchText, contacts]);

  return (
    <View style={styles.container}>
      {/* Navbar */}
      <View style={styles.navbar}>
        <TouchableOpacity onPress={() => router.back()} style={styles.leftGroup}>
          <Ionicons name="arrow-back" size={24} color="#fff" />
          {!searchMode && (
            <View>
              <Text style={styles.navTitle}>Select Contact</Text>
              <Text style={styles.subText}>{contacts.length} contacts</Text>
            </View>
          )}
        </TouchableOpacity>

        <View style={styles.rightGroup}>
          {searchMode ? (
            <TextInput
              autoFocus
              style={styles.searchInput}
              placeholder="Search contacts"
              placeholderTextColor="#ccc"
              value={searchText}
              onChangeText={setSearchText}
              onBlur={() => {
                setSearchMode(false);
                Keyboard.dismiss();
              }}
            />
          ) : (
            <>
              <TouchableOpacity style={{ marginHorizontal: 10 }} onPress={() => setSearchMode(true)}>
                <Feather name="search" size={22} color="#fff" />
              </TouchableOpacity>
              <TouchableOpacity>
                <Entypo name="dots-three-vertical" size={20} color="#fff" />
              </TouchableOpacity>
            </>
          )}
        </View>
      </View>

      {/* Options */}
      {!searchMode && (
        <View style={styles.optionsContainer}>
          <TouchableOpacity style={styles.optionButton}>
            <Ionicons name="people-outline" size={24} color="#2196F3" />
            <Text style={styles.optionText}>New Group</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.optionButton}>
            <Ionicons name="person-add-outline" size={24} color="#2196F3" />
            <Text style={styles.optionText}>New Contact</Text>
          </TouchableOpacity>
        </View>
      )}

      {/* Contact List */}
      <FlatList
        data={filteredContacts}
        keyExtractor={(item, index) => item.id ?? index.toString()}
        renderItem={({ item }) => (
          <View style={styles.contactItem}>
            <Text style={styles.contactName}>{item.name}</Text>
          </View>
        )}
        keyboardShouldPersistTaps="handled"
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  navbar: {
    backgroundColor: '#2196F3',
    paddingTop: 50,
    paddingHorizontal: 16,
    paddingBottom: 12,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  leftGroup: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  rightGroup: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  navTitle: {
    color: '#fff',
    fontSize: 18,
    fontWeight: 'bold',
    marginLeft: 8,
  },
  subText: {
    color: '#eee',
    fontSize: 12,
    marginLeft: 8,
  },
  optionsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    paddingVertical: 16,
  },
  optionButton: {
    alignItems: 'center',
  },
  optionText: {
    marginTop: 6,
    fontSize: 14,
    color: '#444',
  },
  contactItem: {
    padding: 14,
    borderBottomColor: '#ccc',
    borderBottomWidth: 1,
  },
  contactName: {
    fontSize: 16,
  },
  searchInput: {
    backgroundColor: '#1976D2',
    borderRadius: 6,
    paddingHorizontal: 12,
    paddingVertical: 4,
    color: '#fff',
    fontSize: 16,
    width: '95%',
  },
});
