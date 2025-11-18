import React from 'react';
import { ActivityIndicator, Alert, Text, TouchableOpacity, View } from 'react-native';
import { usePochiFunding } from '../hooks/usePochiFunding';

export const PochiFundingButton = () => {
  const { fundPochi, isLoading, error } = usePochiFunding();

  const handleRealPayment = async () => {
    // Confirm real money transaction
    Alert.alert(
      "Real Money Transfer",
      "This will send REAL money from 0110490333 to Pochi la Biashara 0741103341. Continue?",
      [
        { text: "Cancel", style: "cancel" },
        { 
          text: "Send KSH 10", 
          onPress: async () => {
            try {
              await fundPochi(10, "254110490333");
            } catch (err) {
              console.log('Payment failed:', err);
            }
          }
        }
      ]
    );
  };

  return (
    <View style={{ padding: 20, backgroundColor: '#f8f9fa', borderRadius: 10, margin: 10 }}>
      <Text style={{ fontSize: 18, fontWeight: 'bold', marginBottom: 10, textAlign: 'center' }}>
        💰 Real MPesa Transfer
      </Text>
      
      <Text style={{ fontSize: 14, color: '#666', marginBottom: 15, textAlign: 'center' }}>
        From: 0110490333{"\n"}
        To: Pochi la Biashara (0741103341)
      </Text>

      <TouchableOpacity
        onPress={handleRealPayment}
        disabled={isLoading}
        style={{
          backgroundColor: isLoading ? '#ccc' : '#28a745',
          padding: 15,
          borderRadius: 8,
          alignItems: 'center'
        }}
      >
        {isLoading ? (
          <ActivityIndicator color="#fff" />
        ) : (
          <Text style={{ color: 'white', fontSize: 16, fontWeight: 'bold' }}>
            💸 Send KSH 10 to Pochi
          </Text>
        )}
      </TouchableOpacity>
      
      {error && (
        <Text style={{ color: 'red', marginTop: 10, textAlign: 'center', fontSize: 12 }}>
          ❌ {error}
        </Text>
      )}
      
      <Text style={{ fontSize: 10, color: '#999', marginTop: 10, textAlign: 'center' }}>
        This will trigger an M-Pesa prompt on 0110490333
      </Text>
    </View>
  );
};