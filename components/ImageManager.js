import { StyleSheet, Text, View, Button, Alert } from 'react-native'
import React, {useState} from 'react'
import * as ImagePicker from 'expo-image-picker';
import PressableButton from './PressableButton';

const ImageManager = ({ receiveImageURI, updateProfile }) => {
  const [status, requestPermission] = ImagePicker.useCameraPermissions();
  const [imageURI, setImage] = useState("");

  const verifyPermissions = async () => {
    if (status == "granted") {
      return true;
    }
    try {
      const result = await requestPermission();
      if (result.status !== "granted") {
        console.log("Permission denied");
        return false;
      }
      return true;
    }
    catch (e) {
      console.log(e);
      return false;
    }
  };

  const takeImageHandler = async () => {
    try {
      const havePermission = await verifyPermissions();
      console.log(havePermission);
      if (!havePermission) {
        Alert.alert("You need to grant camera permissions to use this feature.");
        return;
      }

      const result = await ImagePicker.launchCameraAsync({
        mediaTypes: ImagePicker.MediaTypeOptions.Images,
        allowsEditing: true,
        aspect: [3, 3],
        quality: 1,
      });

      console.log(result.assets[0].uri);
      receiveImageURI(result.assets[0].uri);
      setImage(result.assets[0].uri);

      if (!result.canceled) {
        setImage(result.uri);
        updateProfile(result.assets[0].uri);
      }
    } catch (e) {
      console.log(e);
    }
  }

  const pickImageHandler = async () => {
    try {
      const havePermission = await verifyPermissions();
      console.log(havePermission);
      if (!havePermission) {
        Alert.alert("You need to grant camera permissions to use this feature.");
        return;
      }

      const result = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ImagePicker.MediaTypeOptions.Images,
        allowsEditing: true,
        aspect: [3, 3],
        quality: 1,
      });

      console.log(result.assets[0].uri);
      receiveImageURI(result.assets[0].uri);
      setImage(result.assets[0].uri);

      if (!result.canceled) {
        setImage(result.uri);
        updateProfile(result.assets[0].uri);
      }
    } catch (e) {
      console.log(e);
    }
  }

  return (
    <View>
      <PressableButton onPress={takeImageHandler} customStyle={styles.button}>
        Take Image
      </PressableButton>
      <PressableButton onPress={pickImageHandler} customStyle={styles.button}>
        Pick Image
      </PressableButton>
    </View>
  )
}

export default ImageManager

const styles = StyleSheet.create({
  container: {
      marginVertical: 10,
  },
  image: {
      width: 100,
      height: 100
  },
  button: {
    marginVertical: 10,
  },
})