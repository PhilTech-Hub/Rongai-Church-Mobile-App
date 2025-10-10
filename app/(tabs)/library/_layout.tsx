import { Stack } from "expo-router";
import React from "react";

export default function LibraryLayout() {
  return (
    <Stack>
      <Stack.Screen name="index" options={{ title: "Library" }} />
      <Stack.Screen name="newsletters" options={{ title: "Newsletters" }} />
      <Stack.Screen name="journals" options={{ title: "Journals" }} />
      <Stack.Screen name="books" options={{ title: "Books" }} />
      <Stack.Screen name="tutorials" options={{ title: "Tutorials" }} />
    </Stack>
  );
}
