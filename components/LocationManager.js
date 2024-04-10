import { View, Button, Image, StyleSheet, Dimensions } from "react-native";
import React, { useState, useEffect } from "react";
import * as Location from "expo-location";
import { mapsApiKey } from "@env";
import { useNavigation, useRoute,} from "@react-navigation/native";

export default function LocationManager({navigation, route}) {
  const [status, requestPermission] = Location.useForegroundPermissions();
  const [location, setLocation] = useState(null);

  useEffect(() => {
    if (route.params) {
      console.log("Review received in LocationManager:", route.params.review);
      console.log("Location received in LocationManager:", route.params.selectedLocation);
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


  // async function locateUserHandler() {
  //   try {
  //     const havePermission = await verifyPermission();
  //     if (!havePermission) {
  //       Alert.alert("You need to give permission");
  //       return;
  //     }
  //     const receivedLocation = await Location.getCurrentPositionAsync();
  //     setLocation({
  //       latitude: receivedLocation.coords.latitude,
  //       longitude: receivedLocation.coords.longitude,
  //     });
  //   } catch (err) {
  //     console.log(err);
  //   }
  // }

  async function locateUserHandler() {
    // if user has not given permission, ask for it
    const havePermission = await verifyPermission();
    if (!havePermission) {
      return;
    }

    // get the location 
    const location = await Location.getCurrentPositionAsync();
    setLocation({
      latitude: location.coords.latitude,
      longitude: location.coords.longitude,
    });
    console.log("User current location in LocationManager:", location);
    navigation.navigate("AddReview", { selectedLocation: location, review: route.params.review });
  }


  function chooseLocationHandler() {
    if (location) {
      navigation.navigate("Map", { initLoc: location, review: route.params.review});
      console.log("Pass from LocationManager to Map:", location, route.params.review );
    } else {
      navigation.navigate("Map", { review: route.params.review });
      console.log("Pass from LocationManager to Map:", route.params.review );
    }
  }
    function saveLocationHandler() {
      //call setDocToDB
      setDocToDB({ location: location }, "users");
      navigation.navigate("Home");
    }
  return (
    <View style={styles.container}>
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
      <Button title="Save Location" onPress={saveLocationHandler} />
    </View>
  );
}


const styles = StyleSheet.create({
  image: { width: Dimensions.get("screen").width, height: 400 },
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
});