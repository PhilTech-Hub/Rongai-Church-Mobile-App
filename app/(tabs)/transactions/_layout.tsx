import { Stack } from "expo-router";
import React from "react";

export default function TransactionsLayout() {
  return (
    <Stack>
      <Stack.Screen
        name="index"
        options={{
          title: "Transactions",
          headerTitleAlign: "center",
        }}
      />
    </Stack>
  );
}
