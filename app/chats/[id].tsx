import { useLocalSearchParams } from 'expo-router';
import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TextInput,
  TouchableOpacity,
  KeyboardAvoidingView,
  Platform,
} from 'react-native';
import { Ionicons, MaterialIcons, Entypo } from '@expo/vector-icons';

export default function ChatThreadScreen() {
  const { id, name } = useLocalSearchParams();
  const [message, setMessage] = useState('');

  const handleSend = () => {
    if (message.trim()) {
      console.log(`Sending: ${message}`);
      // send message to backend here
      setMessage('');
    }
  };

  const handlePickImage = () => {
    console.log('Pick image from gallery');
    // To do: Use expo-image-picker
  };

  const handleTakePhoto = () => {
    console.log('Take a photo');
    // To do: Use expo-camera or image-picker with launchCameraAsync
  };

  const handleSendFile = () => {
    console.log('Send a document');
    // To do: Use expo-document-picker
  };

  return (
    <View style={styles.container}>
      <Text style={styles.chatTitle}>Chat with: {name}</Text>

      {/* Chat messages would go here */}

      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : undefined}
        keyboardVerticalOffset={90}
        style={styles.inputContainer}
      >
        {/* Media Icons */}
        <TouchableOpacity onPress={handleTakePhoto}>
          <Ionicons name="camera-outline" size={24} color="#444" style={styles.icon} />
        </TouchableOpacity>
        <TouchableOpacity onPress={handlePickImage}>
          <Ionicons name="image-outline" size={24} color="#444" style={styles.icon} />
        </TouchableOpacity>
        <TouchableOpacity onPress={handleSendFile}>
          <Entypo name="attachment" size={24} color="#444" style={styles.icon} />
        </TouchableOpacity>

        {/* Text Input */}
        <TextInput
          style={styles.input}
          placeholder="Type your message..."
          value={message}
          onChangeText={setMessage}
          multiline
        />

        {/* Send Icon */}
        <TouchableOpacity onPress={handleSend}>
          <MaterialIcons name="send" size={24} color="#007bff" style={styles.icon} />
        </TouchableOpacity>
      </KeyboardAvoidingView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    paddingHorizontal: 12,
    paddingTop: 16,
  },
  chatTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 12,
  },
  inputContainer: {
    flexDirection: 'row',
    alignItems: 'flex-end',
    paddingVertical: 10,
    paddingHorizontal: 8,
    borderTopWidth: 1,
    borderTopColor: '#ddd',
    backgroundColor: '#f9f9f9',
  },
  input: {
    flex: 1,
    maxHeight: 100,
    marginHorizontal: 8,
    paddingHorizontal: 12,
    paddingVertical: 8,
    backgroundColor: '#fff',
    borderRadius: 20,
    borderWidth: 1,
    borderColor: '#ccc',
  },
  icon: {
    paddingHorizontal: 6,
  },
});
