import { View, Text, StyleSheet, Image, Modal, TextInput, Button, StatusBar } from "react-native";
import React, { useState, useEffect } from "react";
import { auth } from "../firebase-files/firebaseSetup";
import PressableButton from "../components/PressableButton";
import { signOut } from "firebase/auth";
import { Ionicons } from "@expo/vector-icons";
import { fetchUserData, uploadImageAsync, saveImageURLToFirestore, updateUsername, setEmail } from "../firebase-files/databaseHelper";
import ImageManager from "../components/ImageManager";
import ImageInput from "../components/ImageInput";


export default function Profile({navigation, route}) {
  const defaultAvatar = "https://upload.wikimedia.org/wikipedia/commons/7/7c/Profile_avatar_placeholder_large.png";

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

  // Fetch user data from Firestore and set the local state
  useEffect(() => {
    const fetchAndSetUserData = async () => {
      const userId = auth.currentUser.uid;
      const userEmail = auth.currentUser.email;

      const userData = await fetchUserData(userId); // Await the async call to fetch user data
      const fetchedName = userData ? userData.username : null;
      const fetchedAvatarUri = userData ? userData.avatarUrl : null;

      // Update username
      if (!fetchedName) {
        const newGeneratedUsername = generateRandomUsername();
        setUsername(newGeneratedUsername); // Set the new username in the local state
        await updateUsername(userId, newGeneratedUsername);
      } else {
        setUsername(fetchedName);
      }

      // Set the avatar URI 
      setAvatarUri(fetchedAvatarUri ? fetchedAvatarUri : defaultAvatar);

      // Set the email
      await setEmail(userId, userEmail);
    };

    fetchAndSetUserData();
  }, []);


  // a function to handle updating the avatar
  const updateAvatarHandler = async (imageURI) => {
    try {
      const userId = auth.currentUser.uid;
      const imageUrl = await uploadImageAsync(imageURI); // Upload image and get URL
      await saveImageURLToFirestore(userId, imageUrl); // Save image URL to Firestore
      setAvatarUri(imageUrl); // Update local state
      console.log("Avatar updated successfully.");
    } catch (error) {
      console.error("Error updating avatar:", error);
    }
  };



  // a function to handle updating the username
  const updateUsernameHandler = async () => {
    const userId = auth.currentUser.uid;
    try {
      await updateUsername(userId, newUsername.trim()); // Update username in Firestore
      setUsername(newUsername.trim()); // Update local state
      setNewUsername(''); // Reset the newUsername field
      console.log("Username updated successfully.");
    } catch (error) {
      console.error("Error updating username:", error);
    }
  };


  return (
    <View style={styles.container}>

      <StatusBar translucent={true} backgroundColor="transparent" />

      <ImageInput
        imageModalVisible={imageModalVisible}
        dismissModal={() => setImageModalVisible(false)}
        receiveImageURI={receiveImageURI}
        updateURI={updateAvatarHandler}
      />

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
            <View style={{ flexDirection: 'row', justifyContent: 'space-around', width: 200 }}>
              <PressableButton
                customStyle={styles.pressableButtonStyle}
                onPress={() => {
                  updateUsernameHandler();
                  setNameModalVisible(!nameModalVisible);
                }}>
                <Text>Update</Text>
              </PressableButton>
              <PressableButton
                customStyle={{...styles.pressableButtonStyle, backgroundColor: 'gray'}}
                onPress={() => setNameModalVisible(!nameModalVisible)}>
                <Text>Cancel</Text>
              </PressableButton>
            </View>
          </View>
        </View>
      </Modal>

      {/* Display the avatar image */}
      <Image source={{uri:avatarUri}} style={styles.image} />
      <PressableButton
        customStyle={styles.pressableButtonStyle}
        onPress={() => setImageModalVisible(true)}>
        <Text style ={styles.buttonText}>Change Avatar</Text>
      </PressableButton>

      {/* Display the username and other profile info */}
      <Text style={styles.usernameText}>{username}</Text>
      <PressableButton
        customStyle={styles.pressableButtonStyle}
        onPress={() => setNameModalVisible(true)}>
        <Text style ={styles.buttonText}>Change Username</Text>
      </PressableButton>

      <PressableButton
        onPress={() => {navigation.navigate('My Reviews')}}>
        <Text style={styles.goToReviews}>Go to My Reviews 👉</Text>
      </PressableButton>

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
  },
  usernameText: {
    fontSize: 20,
    color: '#333',
    fontWeight: 'bold',
    marginTop: 30,
  },
  buttonText: {
    fontSize: 16,
  },
  pressableButtonStyle: {
    backgroundColor: 'tomato', 
    padding: 7, 
    borderRadius: 10, 
    alignSelf: 'center'
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
    marginBottom: 10,
    fontWeight: 'bold',
    textAlign: "center"
  },
  goToReviews: {
    fontSize: 20,
    color: '#0077CC',
    fontWeight: 'bold',
    marginTop: 10,
  }
});
