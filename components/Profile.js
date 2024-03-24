import { View, Text, StyleSheet } from "react-native";
import React from "react";
import { auth } from "../firebase-files/firebaseSetup";
import PressableButton from "./PressableButton";
import { signOut } from "firebase/auth";
import { Ionicons } from "@expo/vector-icons";

export default function Profile() {
  return (
    <View>
      <Text>{auth.currentUser.uid}</Text>
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
  buttonStyle: {
    marginTop: 20,
    padding: 10,
    backgroundColor: 'tomato',
    borderRadius: 5,
    width: 50,
  },
});