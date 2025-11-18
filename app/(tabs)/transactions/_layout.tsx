import { Stack } from "expo-router";
import React, { useState } from "react";
import { Text, TouchableOpacity } from "react-native";
import PaymentOptionsModal from "../../../components/PaymentOptionsModal";

export default function TransactionsLayout() {
  const [isModalVisible, setModalVisible] = useState(false);

  return (
    <>
      {/* Stack Navigation Header */}
      <Stack>
        <Stack.Screen
          name="index"
          options={{
            title: "Transactions",
            headerTitleAlign: "center",
            headerRight: () => (
              <TouchableOpacity
                onPress={() => setModalVisible(true)}
                style={{
                  backgroundColor: "#2563eb",
                  paddingVertical: 6,
                  paddingHorizontal: 12,
                  borderRadius: 8,
                  marginRight: 10,
                }}
              >
                <Text style={{ color: "#fff", fontWeight: "600", fontSize: 14 }}>
                  + New Payment
                </Text>
              </TouchableOpacity>
            ),
          }}
        />
        {/* Remove the duplicate Stack.Screen with name="index" */}
      </Stack>

      {/* Payment Modal */}
      <PaymentOptionsModal
        visible={isModalVisible}
        onClose={() => setModalVisible(false)}
      />
    </>
  );
}