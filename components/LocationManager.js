import { View, Button, Image, StyleSheet, Dimensions, Alert } from "react-native";
import React, { useState, useEffect } from "react";
import * as Location from "expo-location";
import { mapsApiKey } from "@env";

export default function LocationManager({ navigation, route }) {
  const [status, requestPermission] = Location.useForegroundPermissions();
  const [location, setLocation] = useState(null);

  useEffect(() => {
    if (route.params?.location) {
      setLocation(route.params.location);
    }
  }, [route.params?.location])

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
    // if user has not given permission, ask for it
    const havePermission = await verifyPermission();
    if (!havePermission) {
      return;
    }
    Alert.alert("Locating you... This may take a few seconds.");
    // get the location 
    const location = await Location.getCurrentPositionAsync();
    const newCoords = {
      latitude: location.coords.latitude,
      longitude: location.coords.longitude,
    };
    setLocation({ newCoords });
    console.log("User current location in LocationManager:", newCoords);
    navigation.navigate("Find", { location: newCoords});
  }


  async function chooseLocationHandler() {
    // if user has not given permission, ask for it
    const havePermission = await verifyPermission();
    if (!havePermission) {
      return;
    }
    if (location) {
      navigation.navigate("Map", { 
        location: location 
      });
      console.log("Pass from LocationManager to Map:", location);
    }
  }

  return (
    <View style={styles.container}>

      {location && (
        <Image
          style={styles.image}
          source={{
            uri: `https://maps.googleapis.com/maps/api/staticmap?center=${location.latitude},${location.longitude}&zoom=14&size=2400x1200&maptype=roadmap&markers=color:red%7Clabel:L%7C${location.latitude},${location.longitude}&key=${mapsApiKey}&scale=2`, // Increased size, added scale
          }}
        />
      )}

      <Button title="Choose another location" onPress={chooseLocationHandler} />
      <Button title="Use current location" onPress={locateUserHandler} />

    </View>
  );
}


const styles = StyleSheet.create({
  image: {
    width: Dimensions.get("screen").width * 0.9,
    height: Dimensions.get("screen").height * 0.7,
    // marginLeft: 50,
    // marginRight: 50,
    marginTop: 50,
    borderRadius: 10,
  },
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
});