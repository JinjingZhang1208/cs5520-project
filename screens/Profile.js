import { View, Text, StyleSheet, Image, Modal, TextInput, Button, StatusBar } from "react-native";
import React, { useState, useEffect } from "react";
import { auth } from "../firebase-files/firebaseSetup";
import PressableButton from "../components/PressableButton";
import { signOut } from "firebase/auth";
import { Ionicons } from "@expo/vector-icons";
import { fetchUserData, updateUserProfile } from "../firebase-files/databaseHelper";
import ImageManager from "../components/ImageManager";
import defaultAvatar from "../assets/avatar.png";


export default function Profile() {
  const [avatarUri, setAvatarUri] = useState(defaultAvatar);
  const [username, setUsername] = useState('');
  const [newUsername, setNewUsername] = useState('');
  const [imageModalVisible, setImageModalVisible] = useState(false);
  const [nameModalVisible, setNameModalVisible] = useState(false);

  const receiveImageURI = (imageURI) => {
    console.log("we are receiving", imageURI);
    setAvatarUri(imageURI);
    setImageModalVisible(false); // Close the image modal after selecting an image
  };

  const generateRandomUsername = () => {
    const adjectives = ["Quick", "Lazy", "Jolly", "Happy", "Bright", "Dark", "Light"];
    const nouns = ["Bear", "Fox", "Eagle", "Owl", "Lion", "Tiger", "Wolf"];
    const adjective = adjectives[Math.floor(Math.random() * adjectives.length)];
    const noun = nouns[Math.floor(Math.random() * nouns.length)];
    const number = Math.floor(Math.random() * 1000);
    return `${adjective}${noun}${number}`;
  };

  // fetch user name from database, if not exist, generate random username
  useEffect(() => {
    const fetchAndSetUsername = async () => {
      const userId = auth.currentUser.uid;
      const userData = await fetchUserData(userId); // Await the async call

      const fetchedName = userData ? userData.username : null;
      if (fetchedName) {
        setUsername(fetchedName); // If a username exists, use it
      } else {
        const newGeneratedUsername = generateRandomUsername();
        setUsername(newGeneratedUsername); // Set the new username in the local state
        await updateUserProfile(userId, newGeneratedUsername, auth.currentUser.email); // Update Firebase
      }
    };

    fetchAndSetUsername();
  }, []);


  // a function to handle updating the username
  const handleUpdateUsername = async () => {
    setUsername(newUsername); // Update the local state with the new input
    setNewUsername(''); // Clear the input field
    setNameModalVisible(false); // Close the modal

    const userId = auth.currentUser.uid;
    const email = auth.currentUser.email;

    try {
      // Update user profile in Firestore
      const result = await updateUserProfile(userId, newUsername, email);

      // If the function returns a result, you can check it here
      if (result && result.status === 'success') {
        console.log(result.message); // Or display a success message to the user
      }
    } catch (error) {
      // Catch and handle any errors thrown during the update
      console.error("Error updating user profile:", error);
      // Display an error message to the user
    }
  };


  return (
    <View style={styles.container}>

      <StatusBar translucent={true} backgroundColor="transparent" />

      <Modal
        animationType="slide"
        transparent={true}
        visible={imageModalVisible}
        onRequestClose={() => {
          setImageModalVisible(!imageModalVisible);
        }}>
        <View style={styles.centeredView}>
          <View style={styles.modalView}>
            <Text style={styles.modalText}>Change Avatar</Text>
            <ImageManager receiveImageURI={receiveImageURI} />
            <Button title="Cancel" onPress={() => setImageModalVisible(!imageModalVisible)} />
          </View>
        </View>
      </Modal>

      <Modal
        animationType="slide"
        transparent={true}
        visible={nameModalVisible}
        onRequestClose={() => {
          setNameModalVisible(!nameModalVisible);
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
              setNameModalVisible(!nameModalVisible);
            }} />
            <Button title="Cancel" onPress={() => setNameModalVisible(!nameModalVisible)} />
          </View>
        </View>
      </Modal>

      {/* Display the avatar image */}
      <Image source={avatarUri} style={styles.image} />
      <Button title="Change Avatar" onPress={() => setImageModalVisible(true)} />

      {/* Display the username and other profile info */}
      <Text style={styles.usernameText}>{username}</Text>
      <Button title="Change Username" onPress={() => setNameModalVisible(true)} />

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
