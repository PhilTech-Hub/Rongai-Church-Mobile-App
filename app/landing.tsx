import { useRouter } from "expo-router";
import React, { useEffect, useRef, useState } from "react";
import {
    Animated,
    Dimensions,
    ImageBackground,
    PanResponder,
    StyleSheet,
    Text,
    TouchableOpacity
} from "react-native";

const { height } = Dimensions.get("window");

export default function LandingScreen() {
  const router = useRouter();
  const [displayedText, setDisplayedText] = useState("");
  const fullText = "Welcome to Rongai Church Connect 🙏";
  const fadeAnim = useRef(new Animated.Value(0)).current;
  const translateY = useRef(new Animated.Value(0)).current;

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

  // Function to handle complete swipe
  const handleCompleteSwipe = () => {
    // Animate the background up
    Animated.timing(translateY, {
      toValue: -height,
      duration: 800,
      useNativeDriver: true,
    }).start(() => {
      // Then pop in the index page
      router.replace("/(tabs)");
    });
  };

  // Pan responder for live swipe
  const panResponder = useRef(
    PanResponder.create({
      onMoveShouldSetPanResponder: (_, gesture) => Math.abs(gesture.dy) > 10,
      onPanResponderMove: (_, gesture) => {
        if (gesture.dy < 0) {
          translateY.setValue(gesture.dy); // real-time upward motion
        }
      },
      onPanResponderRelease: (_, gesture) => {
        if (gesture.dy < -150) {
          handleCompleteSwipe();
        } else {
          // revert if not enough swipe
          Animated.spring(translateY, {
            toValue: 0,
            useNativeDriver: true,
          }).start();
        }
      },
    })
  ).current;

  return (
    <Animated.View
      style={[styles.container, { transform: [{ translateY }] }]}
      {...panResponder.panHandlers}
    >
      <ImageBackground
        source={{
          uri: "https://images.unsplash.com/photo-1524499982521-1ffd58dd89ea",
        }}
        style={styles.image}
        resizeMode="cover"
      >
        <Animated.View
          style={[
            StyleSheet.absoluteFillObject,
            { backgroundColor: "rgba(0, 102, 255, 0.5)", opacity: fadeAnim },
          ]}
        />

        <Text style={styles.title}>{displayedText}</Text>

        <TouchableOpacity onPress={handleCompleteSwipe}>
          <Text style={styles.swipeText}>↑ Swipe up to continue</Text>
        </TouchableOpacity>
      </ImageBackground>
    </Animated.View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  image: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  title: {
    color: "orange",
    fontSize: 24,
    fontWeight: "bold",
    textAlign: "center",
    paddingHorizontal: 20,
    opacity: 0.9,
  },
  swipeText: {
    position: "absolute",
    top: 300,
    right: -70,
    color: "white",
    fontSize: 14,
    opacity: 0.9,
  },
});
