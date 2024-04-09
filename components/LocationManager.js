import { View, Button, Image, StyleSheet, Dimensions } from "react-native";
import React, { useState, useEffect } from "react";
import * as Location from "expo-location";
import { mapsApiKey } from "@env";
import { useNavigation, useRoute,  } from "@react-navigation/native";

export default function LocationManager() {
  const navigation = useNavigation();
  const route = useRoute();
  // use route.params to receive selected location (if it exists) and show a marker for that on the static map
  const [status, requestPermission] = Location.useForegroundPermissions();
  const [location, setLocation] = useState(null);
  
  useEffect(() => {
    if (route.params) {
      setLocation(route.params.selectedLocation);
    }
  }, [route.params]);

  async function verifyPermission() {
    if (status.granted) {
      return true;
    }
    try {
      const permissionResponse = await requestPermission();
      return permissionResponse.granted;
    } catch (err) {
      console.log(err);
    }
  }

  async function locateUserHandler() {
    // call verifypermission

    try {
      const havePermission = await verifyPermission();
      if (!havePermission) {
        Alert.alert("You need to give permission");
        return;
      }
      const receivedLocation = await Location.getCurrentPositionAsync();
      setLocation({
        latitude: receivedLocation.coords.latitude,
        longitude: receivedLocation.coords.longitude,
      });
    } catch (err) {
      console.log(err);
    }
  }

  function chooseLocationHandler() {
    if (location) {
      navigation.navigate("Map", {initLoc: location});
    } else {
      navigation.navigate("Map");
    }
    
  }
//   function saveLocationHandler() {
//     //call setDocToDB
//     setDocToDB({ location: location }, "users");
//     navigation.navigate("Home");
//   }
  return (
    <View>
      <Button title="Use my current location" onPress={locateUserHandler} />
      <Button title="Choose another location" onPress={chooseLocationHandler} />
      {location && (
        <Image
          style={styles.image}
          source={{
            uri: `https://maps.googleapis.com/maps/api/staticmap?center=${location.latitude},${location.longitude}&zoom=14&size=400x200&maptype=roadmap&markers=color:red%7Clabel:L%7C${location.latitude},${location.longitude}&key=${mapsApiKey}`,
          }}
        />
      )}
      {/* <Button title="Save Location" onPress={saveLocationHandler} /> */}
    </View>
  );
}

const styles = StyleSheet.create({
  image: { width: Dimensions.get("screen").width, height: 200 },
});