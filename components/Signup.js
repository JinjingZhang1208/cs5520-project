import React, { useState } from "react";
import { View, Text, TextInput, TouchableOpacity, StyleSheet, Alert } from "react-native";
import { createUserWithEmailAndPassword } from "firebase/auth";
import { auth } from "../firebase-files/firebaseSetup"; 

export default function Signup({ navigation }) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  const loginHandler = () => {
    navigation.navigate("Login");
  };

  const signupHandler = async () => {
    if (password.length < 6) {
      Alert.alert("Please choose a password with at least 6 characters.");
      return;
    }

    if (password !== confirmPassword) {
      Alert.alert("Passwords do not match.");
      return;
    }

    if (!email || !password || !confirmPassword) {
      Alert.alert("Fields should not be empty");
      return;
    }

    try {
      const userCred = await createUserWithEmailAndPassword(
        auth,
        email,
        password
      );
      console.log(userCred);
      // Clear form fields upon successful signup
      setEmail("");
      setPassword("");
      setConfirmPassword("");
      Alert.alert("Signup successful", "You have successfully signed up!");

    } catch (err) {
      console.log(err.code);
      if (err.code === "auth/email-already-in-use") {
        Alert.alert("This email is already signed up");
      } else if (err.code === "auth/weak-password") {
        Alert.alert("Your password is weak");
      } else {
        Alert.alert("Signup failed", "An unexpected error occurred. Please try again later.");
      }
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.label}>Email</Text>
      <TextInput
        style={styles.input}
        placeholder="Email"
        value={email}
        onChangeText={(changedText) => setEmail(changedText)}
      />
      <Text style={styles.label}>Password</Text>
      <TextInput
        style={styles.input}
        secureTextEntry={true}
        placeholder="Password"
        value={password}
        onChangeText={(changedText) => setPassword(changedText)}
      />
      <Text style={styles.label}>Confirm Password</Text>
      <TextInput
        style={styles.input}
        secureTextEntry={true}
        placeholder="Confirm Password"
        value={confirmPassword}
        onChangeText={(changedText) => setConfirmPassword(changedText)}
      />
      <View style={styles.buttonRow}>
        <TouchableOpacity style={styles.button} onPress={signupHandler}>
          <Text style={styles.buttonText}>Register</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.button} onPress={loginHandler}>
          <Text style={styles.buttonText}>Already Registered?</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    padding: 20,
  },
  label: {
    fontSize: 18,
    marginBottom: 5,
  },
  input: {
    width: "100%",
    height: 40,
    borderWidth: 1,
    borderColor: "#ccc",
    borderRadius: 5,
    marginBottom: 10,
    paddingHorizontal: 10,
  },
  buttonRow: {
    flexDirection: 'row',
    justifyContent: 'center',
    marginBottom: 10,
    marginRight: 40,
    marginLeft: 40,
  },
  button: {
    backgroundColor: '#795458',
    paddingHorizontal: 20,
    paddingVertical: 10,
    borderRadius: 8,
    backgroundColor: '#453F78',
    marginLeft: 35,
    marginRight: 10,
    marginTop: 20,
  },
  buttonText: {
    color: 'white',
    fontSize: 16,
  },
});