import { View, Text, StyleSheet, Image, Modal, TextInput, Button } from "react-native";
import React, { useState, useEffect } from "react";
import { auth } from "../firebase-files/firebaseSetup";
import PressableButton from "../components/PressableButton";
import { signOut } from "firebase/auth";
import { Ionicons } from "@expo/vector-icons";

export default function Profile() {
  const [username, setUsername] = useState('');
  const [newUsername, setNewUsername] = useState('');
  const [modalVisible, setModalVisible] = useState(false);

  const generateRandomUsername = () => {
    const adjectives = ["Quick", "Lazy", "Jolly", "Happy", "Bright", "Dark", "Light"];
    const nouns = ["Bear", "Fox", "Eagle", "Owl", "Lion", "Tiger", "Wolf"];
    const adjective = adjectives[Math.floor(Math.random() * adjectives.length)];
    const noun = nouns[Math.floor(Math.random() * nouns.length)];
    const number = Math.floor(Math.random() * 1000);
    return `${adjective}${noun}${number}`;
  };

  const handleUpdateUsername = () => {
    setUsername(newUsername); // Update the username with the new input
    setNewUsername(''); // Clear the input field
  };
  

  useEffect(() => {
    // Generate username when component mounts
    const generatedUsername = generateRandomUsername();
    setUsername(generatedUsername);
  }, []);

  return (
    <View style={styles.container}>

      <Modal
        animationType="slide"
        transparent={true}
        visible={modalVisible}
        onRequestClose={() => {
          setModalVisible(!modalVisible);
        }}>
        <View style={styles.centeredView}>
          <View style={styles.modalView}>
            <Text style={styles.modalText}>Change Username</Text>
            <TextInput
              style={styles.input}
              onChangeText={setNewUsername}
              value={newUsername}
              placeholder="Enter new username"
            />
            <Button title="Update" onPress={() => {
              handleUpdateUsername();
              setModalVisible(!modalVisible);
            }} />
            <Button title="Cancel" onPress={() => setModalVisible(!modalVisible)} />
          </View>
        </View>
      </Modal>

      {/* Image source later should be from user photo/camera */}
      <Image source={{ uri: "https://upload.wikimedia.org/wikipedia/en/0/0f/Space_Invaders_flyer%2C_1978.jpg", }} style={styles.image} />

      {/* Use generated username instead of uid */}
      <Text style={styles.usernameText}>{username}</Text>
    <Button title="Change Username" onPress={() => setModalVisible(true)} />
    
    <Text style={styles.emailText}>{auth.currentUser.email}</Text>

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
  centeredView: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    marginTop: 0, 
    backgroundColor: 'rgba(0, 0, 0, 0.5)', 
  },
  modalView: {
    margin: 20,
    backgroundColor: "white",
    borderRadius: 20,
    padding: 35,
    alignItems: "center",
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2
    },
    shadowOpacity: 0.25,
    shadowRadius: 4,
    elevation: 5
  },
  image: {
    width: 100,
    height: 100,
    borderRadius: 50,
    marginBottom: 20,
  },
  usernameText: {
    fontSize: 20, 
    color: '#333', 
    fontWeight: 'bold', 
    marginTop: 10, 
  },
  emailText: {
    fontSize: 16, 
    color: '#555', 
    marginTop: 5, 
  },
  buttonStyle: {
    marginTop: 20,
    padding: 10,
    backgroundColor: 'tomato',
    borderRadius: 5,
    width: 50, 
  },
  input: {
    height: 40,
    margin: 12,
    borderWidth: 1,
    padding: 10,
    width: 200, 
  },
  modalText: {
    marginBottom: 15,
    textAlign: "center"
  },
});
