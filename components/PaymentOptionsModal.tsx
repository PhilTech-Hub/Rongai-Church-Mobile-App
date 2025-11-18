import React, { useState } from "react";
import { Modal, ScrollView, Text, TouchableOpacity, View } from "react-native";
import { PaymentMethod, PaymentOption } from "../lib/paymentConfig";
import PaymentFormModal from "./PaymentFormModal";
import PaymentMethodModal from "./PaymentMethodModal";

const paymentOptions: PaymentOption[] = [
  "Tithe",
  "Offering",
  "Youth Membership",
  "Church Membership Registration",
  "Church Emergency Fund",
  "Youth Monthly Contributions",
  "Youth Emergency Fund",
];

interface PaymentOptionsModalProps {
  visible: boolean;
  onClose: () => void;
}

export default function PaymentOptionsModal({ visible, onClose }: PaymentOptionsModalProps) {
  const [showPaymentMethod, setShowPaymentMethod] = useState(false);
  const [showPaymentForm, setShowPaymentForm] = useState(false);
  const [selectedOption, setSelectedOption] = useState<PaymentOption>("Tithe");
  const [selectedMethod, setSelectedMethod] = useState<PaymentMethod>("paybill");

  const handleOptionSelect = (option: PaymentOption) => {
    setSelectedOption(option);
    setShowPaymentMethod(true);
  };

  const handleMethodSelect = (method: PaymentMethod) => {
    setSelectedMethod(method);
    setShowPaymentMethod(false);
    setShowPaymentForm(true);
  };

  const handlePaymentFormClose = () => {
    setShowPaymentForm(false);
    setSelectedOption("Tithe");
    setSelectedMethod("paybill");
  };

  const handlePaymentMethodClose = () => {
    setShowPaymentMethod(false);
    setSelectedOption("Tithe");
  };

  return (
    <>
      <Modal visible={visible} animationType="slide" transparent>
        <View style={{ flex: 1, backgroundColor: "rgba(0,0,0,0.3)", justifyContent: "center" }}>
          <View style={{ backgroundColor: "#fff", margin: 20, borderRadius: 12, padding: 20 }}>
            <Text style={{ fontSize: 18, fontWeight: "bold", marginBottom: 16 }}>
              Select Payment Destination
            </Text>

            <ScrollView>
              {paymentOptions.map((option: PaymentOption) => (
                <TouchableOpacity
                  key={option}
                  onPress={() => handleOptionSelect(option)}
                  style={{
                    backgroundColor: "#2563eb",
                    padding: 12,
                    borderRadius: 8,
                    marginBottom: 10,
                  }}
                >
                  <Text style={{ color: "#fff", fontWeight: "600", textAlign: "center" }}>
                    {option}
                  </Text>
                </TouchableOpacity>
              ))}
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

      <PaymentMethodModal
        visible={showPaymentMethod}
        onClose={handlePaymentMethodClose}
        selectedOption={selectedOption}
        onMethodSelect={handleMethodSelect}
      />

      <PaymentFormModal
        visible={showPaymentForm}
        onClose={handlePaymentFormClose}
        selectedOption={selectedOption}
        selectedMethod={selectedMethod}
      />
    </>
  );
}