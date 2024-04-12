import { StyleSheet, Text, TextInput, View, Button, Alert } from 'react-native';
import React, { useState, useEffect } from 'react';
import PressableButton from '../components/PressableButton';
import { Picker } from '@react-native-picker/picker';
import { fetchAndPrepareRestaurants } from '../services/YelpService';
import { useNavigation } from '@react-navigation/native';
import * as Location from 'expo-location';

const Find = ({route, navigation}) => {
  const [searchKeyword, setSearchKeyword] = useState('');
  const [searchDistance, setSearchDistance] = useState("3");
  const [searchRating, setSearchRating] = useState("4");
  const [showDistancePicker, setShowDistancePicker] = useState(false);
  const [showRatingPicker, setShowRatingPicker] = useState(false);
  const [minReviewCount, setMinReviewCount] = useState('0');
  // const [searchResults, setSearchResults] = useState([]);

  const [status, requestPermission] = Location.useForegroundPermissions();
  const [userCurrLoc, setUserCurrLoc] = useState(null);
  const [userCurrLocName, setUserCurrLocName] = useState('');
  const [location, setLocation] = useState(null);
  const [locationName, setLocationName] = useState('Loading your current location...');

    // User location state
    useEffect(() => {
      (async () => {
        if (!userCurrLoc) {
          coords = await fetchUserLocation();
          if (!coords) {
            // if location is null (permission denied or error)
            return;
          }
          setUserCurrLoc(coords);
          setLocation(coords);

          const locName = await getLocationNameFromCoords(coords.latitude, coords.longitude);
          setUserCurrLocName(locName);
          setLocationName(locName);
        }
      })();
    }, []);

    // Update location name when location changes
    useEffect(() => {
      async function fetchNewLocationName() {
          if (route.params?.location) {
            console.log('route.params.location:', route.params.location);
            setLocation(route.params.location);

            const lat = route.params.location.latitude;
            const long = route.params.location.longitude;
            const name = await getLocationNameFromCoords(lat, long);
            setLocationName(name);
          }
      }
      fetchNewLocationName();
    }, [route.params?.location])

  // Verify location permission
  async function verifyPermission() {
    console.log('Status:', status)
    if (status && status.granted) {
      return true;
    }
    try {
      const permissionResponse = await requestPermission();
      return permissionResponse.granted;
    } catch (err) {
      console.log(err);
    }
  }

  // Fetch user current location
  async function fetchUserLocation() {
    try {
      const havePermission = await verifyPermission();
      if (!havePermission) {
        return null;
      }

      let location = await Location.getCurrentPositionAsync({});
      return location.coords;
    } catch (error) {
      Alert.alert('Cannot found your current location');
      console.error('Error fetching user location:', error);
      return null;
    }
  }

  // Function to convert coordinates to a readable location name
  async function getLocationNameFromCoords(latitude, longitude) {
    const locationDetails = await Location.reverseGeocodeAsync({ latitude, longitude });
    if (locationDetails && locationDetails.length > 0) {
      return `${locationDetails[0].name}, ${locationDetails[0].street}, ${locationDetails[0].city}`;
    }
    return 'Location name not found';
  }

  const search = async () => {
    const radius = searchDistance * 1000; // Convert km to meters

    Alert.alert('Searching for restaurants... This may take a few seconds...');
    try {
      const restaurants = await fetchAndPrepareRestaurants(
        locationName, // 
        searchKeyword,
        radius,
        searchRating,
        minReviewCount
      );

      console.log('Search results:', restaurants);
      navigation.navigate('Search Results', { results: restaurants }); // Navigate and pass results

    } catch (error) {
      console.error('Error fetching or preparing restaurant data:', error);
    }
  }



  return (
    <View style={styles.container}>

      {/* Restaurant name input */}
      <TextInput
        style={styles.TextInput}
        placeholder='Search for restaurants'
        onChangeText={setSearchKeyword}
        value={searchKeyword}
      />

      <Text style={styles.location}>📍{locationName}</Text>

      <PressableButton  
        customStyle={styles.locationButtonStyle}
        onPress={() => navigation.navigate('LocationManager', {location: location})}>
        <Text>Choose Location</Text>
      </PressableButton>

      {/* Rating Picker */}
      <View style={styles.horizontal}>
        <Text style={styles.text}>Sort by Rating </Text>
        <TextInput
          style={styles.textInputforPicker}
          placeholder='Rating'
          onChangeText={setSearchRating}
          value={searchRating}
          onFocus={() => setShowRatingPicker(true)}
          onBlur={() => setShowRatingPicker(false)}
        />
        <Text style={styles.text}> Stars</Text>
        {showRatingPicker && (
          <Picker
            selectedValue={searchRating}
            onValueChange={(itemValue, itemIndex) => {
              setSearchRating(itemValue);
              setShowRatingPicker(false);
            }}
            style={styles.pickerStyle}>
            <Picker.Item label="Any Rating" value="0" />
            <Picker.Item label="4 Stars & Up" value="4" />
            <Picker.Item label="3 Stars & Up" value="3" />
            <Picker.Item label="2 Stars & Up" value="2" />
            <Picker.Item label="1 Star & Up" value="1" />
          </Picker>
        )}
      </View>

      {/* Distance Picker */}
      <View style={styles.horizontal}>
        <Text style={styles.text}>Sort by Distance </Text>
        <TextInput
          style={styles.textInputforPicker}
          placeholder='Distance in km'
          onChangeText={setSearchDistance}
          value={searchDistance}
          onFocus={() => setShowDistancePicker(true)}
          onBlur={() => setShowDistancePicker(false)}
        />
        <Text style={styles.text}> km</Text>
        {showDistancePicker && (
          <Picker
            selectedValue={searchDistance}
            onValueChange={(itemValue, itemIndex) => {
              setSearchDistance(itemValue);
              setShowDistancePicker(false);
            }}
            style={styles.pickerStyle}>
            <Picker.Item label="1 km" value="1" />
            <Picker.Item label="3 km" value="3" />
            <Picker.Item label="5 km" value="5" />
            <Picker.Item label="10 km" value="10" />
            <Picker.Item label="15 km" value="15" />
          </Picker>
        )}
      </View>

      <View style={styles.horizontal}>
        <Text style={styles.text}>Minimum </Text>
        <TextInput
          style={styles.textInputforPicker}
          placeholder='Min Reviews'
          onChangeText={setMinReviewCount}
          value={minReviewCount}
        />
        <Text style={styles.text}> Reviews </Text>
      </View>

      <View style={styles.buttonContainer}>
        <PressableButton
          onPress={() => search()}
          customStyle={styles.searchButton}
        >
          Search
        </PressableButton>
      </View>


    </View>
  )
}

export default Find;

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  horizontal: {
    flexDirection: 'row',
    marginLeft: 30,
    // justifyContent: 'center',
    // alignItems: 'center',
    padding: 10,
  },
  TextInput: {
    marginTop: 50,
    marginLeft: 30,
    marginRight: 30,
    marginBottom: 10,
    fontSize: 18,
    fontWeight: 'bold',
    height: 60,
    padding: 15,
    borderRadius: 5,
    borderWidth: 2,
    borderColor: 'tomato',
  },
  textInputforPicker: {
    fontSize: 18,
    fontWeight: 'bold',
  },
  text: {
    fontSize: 15,
    color: 'tomato',
    fontWeight: 'bold',
    // textAlign: 'center',
  },
  textChoicer: {
    fontSize: 15,
    fontWeight: 'bold',
    // textAlign: 'center',
  },
  pickerStyle: {
    height: 20,
    width: '60%',
    alignSelf: 'center',
  },
  buttonContainer: {
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 20,
  },
  searchButton: {
    width: '70%',
    paddingVertical: 10,
    paddingHorizontal: 20,
    backgroundColor: 'tomato',
    color: 'white',
    fontSize: 20,
    borderRadius: 20,
  },
  location: {
    fontSize: 12,
    color: 'grey',
    marginLeft: 30,
    marginTop: 1,
  },

  locationButtonStyle: {
    backgroundColor: 'lightblue',
    padding: 7,
    borderRadius: 10,
    marginTop: 5,
    marginBottom: 5,
    marginLeft: 30,
    width: 200,
    alignSelf: 'flex-start'
  }
})
