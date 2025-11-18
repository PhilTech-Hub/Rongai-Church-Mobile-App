import React, { useState } from 'react';
import { Alert, Modal, ScrollView, Text, TextInput, TouchableOpacity, View } from 'react-native';
import { makePayment } from '../lib/api/payments';
import { PAYMENT_CONFIG, PAYMENT_METHODS, PaymentAccountDetails, PaymentMethod, PaymentOption } from '../lib/paymentConfig';

interface PaymentFormModalProps {
  visible: boolean;
  onClose: () => void;
  selectedOption: PaymentOption;
  selectedMethod: PaymentMethod;
}

interface AdditionalInfo {
  senderBank?: string;
  transactionRef?: string;
}

export default function PaymentFormModal({ 
  visible, 
  onClose, 
  selectedOption, 
  selectedMethod 
}: PaymentFormModalProps) {
  const [amount, setAmount] = useState("");
  const [description, setDescription] = useState("");
  const [isProcessing, setIsProcessing] = useState(false);
  const [additionalInfo, setAdditionalInfo] = useState<AdditionalInfo>({});

  const paymentOption = PAYMENT_CONFIG.paymentDestinations[selectedOption];
  const methodConfig = PAYMENT_CONFIG.methods[selectedMethod];
  const accountDetails = paymentOption?.accounts[selectedMethod as keyof PaymentAccountDetails];

  const handlePayment = async () => {
    if (!amount || isNaN(Number(amount)) || Number(amount) <= 0) {
        Alert.alert("Error", "Please enter a valid amount");
        return;
    }

    if (!description.trim()) {
        Alert.alert("Error", "Please enter a description");
        return;
    }

    if (!selectedMpesaNumber) {
        Alert.alert("Error", "Please select an M-Pesa number");
        return;
    }

    setIsProcessing(true);
    try {
        const userId = "test_user"; // For testing - will replace with Firebase Auth later
        
        const paymentData = {
        destination: selectedOption,
        method: selectedMethod,
        amount: Number(amount),
        description: description.trim(),
        userId,
        accountDetails: {
            phoneNumber: "0110490333" // Church number
        },
        senderPhoneNumber: selectedMpesaNumber
        };

        const response = await makePayment(paymentData);
        
        Alert.alert(
        "Payment Initiated", 
        `Payment of KES ${amount} to ${selectedOption} has been initiated!\n\nFrom: ${selectedMpesaNumber}\nTo: 0110490333 (Church)\n\nYou can check transactions tab for status.`,
        [{ text: "OK" }]
        );

        resetForm();
        onClose();
    } catch (error: any) {
        Alert.alert("Payment Failed", error.message || "Failed to initiate payment. Please try again.");
    } finally {
        setIsProcessing(false);
    }
    };

  const resetForm = () => {
    setAmount("");
    setDescription("");
    setAdditionalInfo({});
  };

  const handleClose = () => {
    resetForm();
    onClose();
  };

  const renderAccountDetails = () => {
    if (!accountDetails) return null;

    return (
      <View style={{ marginBottom: 16, padding: 12, backgroundColor: "#f3f4f6", borderRadius: 8 }}>
        <Text style={{ fontWeight: "bold", marginBottom: 8 }}>Payment Details:</Text>
        {Object.entries(accountDetails).map(([key, value]) => (
          <Text key={key} style={{ fontSize: 12, marginBottom: 2 }}>
            {key.charAt(0).toUpperCase() + key.slice(1)}: {typeof value === 'object' ? JSON.stringify(value) : value}
          </Text>
        ))}
      </View>
    );
  };

  const renderAdditionalFields = () => {
    if (selectedMethod === PAYMENT_METHODS.BANK_ACCOUNT) {
      return (
        <>
          <Text style={{ marginBottom: 8, fontWeight: "600" }}>Your Bank Name</Text>
          <TextInput
            value={additionalInfo.senderBank || ""}
            onChangeText={(text) => setAdditionalInfo({...additionalInfo, senderBank: text})}
            placeholder="Enter your bank name"
            style={{
              borderWidth: 1,
              borderColor: "#ddd",
              borderRadius: 8,
              padding: 12,
              marginBottom: 16,
            }}
          />

          <Text style={{ marginBottom: 8, fontWeight: "600" }}>Transaction Reference</Text>
          <TextInput
            value={additionalInfo.transactionRef || ""}
            onChangeText={(text) => setAdditionalInfo({...additionalInfo, transactionRef: text})}
            placeholder="Enter transaction reference"
            style={{
              borderWidth: 1,
              borderColor: "#ddd",
              borderRadius: 8,
              padding: 12,
              marginBottom: 16,
            }}
          />
        </>
      );
    }

    if (selectedMethod === PAYMENT_METHODS.SEND_MONEY) {
      return (
        <View style={{ marginBottom: 16, padding: 12, backgroundColor: "#fef3cd", borderRadius: 8 }}>
          <Text style={{ fontSize: 12, color: "#92400e" }}>
            💡 You will receive an M-Pesa prompt to send money to the specified number
          </Text>
        </View>
      );
    }

    return null;
  };

  return (
    <Modal visible={visible} animationType="slide" transparent>
      <View style={{ flex: 1, backgroundColor: "rgba(0,0,0,0.3)", justifyContent: "center" }}>
        <View style={{ backgroundColor: "#fff", margin: 20, borderRadius: 12, padding: 20, maxHeight: '80%' }}>
          <ScrollView>
            <Text style={{ fontSize: 18, fontWeight: "bold", marginBottom: 16 }}>
              {methodConfig?.name} - {selectedOption}
            </Text>

            {renderAccountDetails()}

            <Text style={{ marginBottom: 8, fontWeight: "600" }}>Amount (KES)</Text>
            <TextInput
              value={amount}
              onChangeText={setAmount}
              placeholder="Enter amount"
              keyboardType="numeric"
              style={{
                borderWidth: 1,
                borderColor: "#ddd",
                borderRadius: 8,
                padding: 12,
                marginBottom: 16,
              }}
            />

            <Text style={{ marginBottom: 8, fontWeight: "600" }}>Description</Text>
            <TextInput
              value={description}
              onChangeText={setDescription}
              placeholder="Enter payment description"
              style={{
                borderWidth: 1,
                borderColor: "#ddd",
                borderRadius: 8,
                padding: 12,
                marginBottom: 16,
                height: 80,
                textAlignVertical: "top",
              }}
              multiline
            />

            {renderAdditionalFields()}

            <TouchableOpacity
              onPress={handlePayment}
              disabled={isProcessing}
              style={{
                backgroundColor: isProcessing ? "#9ca3af" : "#2563eb",
                padding: 12,
                borderRadius: 8,
                marginBottom: 10,
              }}
            >
              <Text style={{ color: "#fff", fontWeight: "600", textAlign: "center" }}>
                {isProcessing ? "Processing..." : `Pay with ${methodConfig?.name}`}
              </Text>
            </TouchableOpacity>

            <TouchableOpacity
              onPress={handleClose}
              disabled={isProcessing}
              style={{ alignItems: "center" }}
            >
              <Text style={{ color: "#2563eb" }}>Cancel</Text>
            </TouchableOpacity>
          </ScrollView>
        </View>
      </View>
    </Modal>
  );
}

const getCurrentUserId = async (): Promise<string> => {
  // Implement based on your authentication system
  return "user_id_placeholder";
};