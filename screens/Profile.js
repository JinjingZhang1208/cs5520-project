import { View, Text, StyleSheet, Image } from "react-native";
import React, { useState, useEffect } from "react";
import { auth } from "../firebase-files/firebaseSetup";
import PressableButton from "../components/PressableButton";
import { signOut } from "firebase/auth";
import { Ionicons } from "@expo/vector-icons";

export default function Profile() {
  const [username, setUsername] = useState('');
  
  const generateRandomUsername = () => {
    const adjectives = ["Quick", "Lazy", "Jolly", "Happy", "Bright", "Dark", "Light"];
    const nouns = ["Bear", "Fox", "Eagle", "Owl", "Lion", "Tiger", "Wolf"];
    const adjective = adjectives[Math.floor(Math.random() * adjectives.length)];
    const noun = nouns[Math.floor(Math.random() * nouns.length)];
    const number = Math.floor(Math.random() * 1000);
    return `${adjective}${noun}${number}`;
  };

  useEffect(() => {
    // Generate username when component mounts
    const generatedUsername = generateRandomUsername();
    setUsername(generatedUsername);
  }, []);

  return (
    <View style={styles.container}>
      {/* Image source later should be from user photo/camera */}
      <Image source={{uri:"https://upload.wikimedia.org/wikipedia/en/0/0f/Space_Invaders_flyer%2C_1978.jpg",}} style={styles.image} /> 

      {/* Use generated username instead of uid */}
      <Text>{username}</Text>
      <Text>{auth.currentUser.email}</Text>

      <PressableButton
        onPress={() => {
          signOut(auth)
            .catch((error) => console.error("Error signing out:", error));
        }}
        customStyle={styles.buttonStyle}
      >
        <Ionicons name="log-out-outline" size={24} color="white" /> 
      </PressableButton>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
    alignItems: "center",
    justifyContent: "center",
  },
  image: {
    width: 100,
    height: 100,
    borderRadius: 50,
    marginBottom: 20,
  },
  buttonStyle: {
    marginTop: 20,
    padding: 10,
    backgroundColor: 'tomato',
    borderRadius: 5,
    width: 50,
  },
});