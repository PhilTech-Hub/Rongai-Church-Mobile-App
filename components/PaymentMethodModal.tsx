import React from 'react';
import { Modal, ScrollView, Text, TouchableOpacity, View } from 'react-native';
import { PAYMENT_CONFIG, PaymentMethod, PaymentOption } from '../lib/paymentConfig';

interface PaymentMethodModalProps {
  visible: boolean;
  onClose: () => void;
  selectedOption: PaymentOption;
  onMethodSelect: (method: PaymentMethod) => void;
}

export default function PaymentMethodModal({ 
  visible, 
  onClose, 
  selectedOption, 
  onMethodSelect 
}: PaymentMethodModalProps) {
  const paymentOption = PAYMENT_CONFIG.paymentDestinations[selectedOption];
  
  if (!paymentOption) return null;

  const availableMethods = paymentOption.methods;

  return (
    <Modal visible={visible} animationType="slide" transparent>
      <View style={{ flex: 1, backgroundColor: "rgba(0,0,0,0.3)", justifyContent: "center" }}>
        <View style={{ backgroundColor: "#fff", margin: 20, borderRadius: 12, padding: 20 }}>
          <Text style={{ fontSize: 18, fontWeight: "bold", marginBottom: 16 }}>
            Select Payment Method - {selectedOption}
          </Text>

          <ScrollView>
            {availableMethods.map((method: PaymentMethod) => {
              const methodConfig = PAYMENT_CONFIG.methods[method];
              return (
                <TouchableOpacity
                  key={method}
                  onPress={() => onMethodSelect(method)}
                  style={{
                    backgroundColor: "#2563eb",
                    padding: 12,
                    borderRadius: 8,
                    marginBottom: 10,
                  }}
                >
                  <Text style={{ color: "#fff", fontWeight: "600", textAlign: "center" }}>
                    {methodConfig.name}
                  </Text>
                  <Text style={{ color: "#fff", fontSize: 12, textAlign: "center", marginTop: 4 }}>
                    {methodConfig.description}
                  </Text>
                </TouchableOpacity>
              );
            })}
          </ScrollView>

          <TouchableOpacity
            onPress={onClose}
            style={{ marginTop: 10, alignItems: "center" }}
          >
            <Text style={{ color: "#2563eb" }}>Cancel</Text>
          </TouchableOpacity>
        </View>
      </View>
    </Modal>
  );
}