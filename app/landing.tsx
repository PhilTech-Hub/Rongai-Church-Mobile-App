import { useRouter } from "expo-router";
import React, { useEffect, useState } from "react";
import {
    Animated,
    ImageBackground,
    PanResponder,
    StyleSheet,
    Text,
    View,
} from "react-native";

export default function LandingScreen() {
  const router = useRouter();
  const [displayedText, setDisplayedText] = useState("");
  const fullText = "Welcome to Rongai Church Connect 🙏";
  const [fadeAnim] = useState(new Animated.Value(0));

  // Typing animation
  useEffect(() => {
    let index = 0;
    const typing = setInterval(() => {
      setDisplayedText(fullText.slice(0, index));
      index++;
      if (index > fullText.length) clearInterval(typing);
    }, 80);
    return () => clearInterval(typing);
  }, []);

  // Fade in overlay
  useEffect(() => {
    Animated.timing(fadeAnim, {
      toValue: 1,
      duration: 1500,
      useNativeDriver: true,
    }).start();
  }, []);

  // Swipe up detection
  const panResponder = PanResponder.create({
    onMoveShouldSetPanResponder: (_, gesture) => Math.abs(gesture.dy) > 20,
    onPanResponderRelease: (_, gesture) => {
      if (gesture.dy < -100) {
        router.replace("/(tabs)"); // move to home after swipe
      }
    },
  });

  return (
    <View style={{ flex: 1 }} {...panResponder.panHandlers}>
      <ImageBackground
        source={{
          uri: "https://images.unsplash.com/photo-1524499982521-1ffd58dd89ea",
        }}
        style={{ flex: 1, justifyContent: "center", alignItems: "center" }}
        resizeMode="cover"
      >
        <Animated.View
          style={[
            StyleSheet.absoluteFillObject,
            { backgroundColor: "rgba(0, 102, 255, 0.5)", opacity: fadeAnim },
          ]}
        />

        <Text
          style={{
            color: "white",
            fontSize: 24,
            fontWeight: "bold",
            textAlign: "center",
            paddingHorizontal: 20,
          }}
        >
          {displayedText}
        </Text>

        <Text
          style={{
            position: "absolute",
            bottom: 40,
            color: "white",
            fontSize: 14,
            opacity: 0.8,
          }}
        >
          ↑ Swipe up to continue
        </Text>
      </ImageBackground>
    </View>
  );
}
