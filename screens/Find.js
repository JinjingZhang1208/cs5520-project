import { StyleSheet, Text, TextInput, View, Button, Alert } from 'react-native';
import React, { useState, useEffect } from 'react';
import PressableButton from '../components/PressableButton';
import { Picker } from '@react-native-picker/picker';
import { fetchAndPrepareRestaurants } from '../services/YelpService';
import { useNavigation } from '@react-navigation/native';
import * as Location from 'expo-location';

const Find = () => {
  const [searchKeyword, setSearchKeyword] = useState('');
  const [searchDistance, setSearchDistance] = useState("3");
  const [searchRating, setSearchRating] = useState("4");
  const [showDistancePicker, setShowDistancePicker] = useState(false);
  const [showRatingPicker, setShowRatingPicker] = useState(false);
  const [searchResults, setSearchResults] = useState([]);
  const [userLocation, setUserLocation] = useState(null);
  const [userCurrLocName, setUserCurrLocName] = useState('');
  const navigation = useNavigation();


  // User location state
  useEffect(() => {
    (async () => {
      const coords = await fetchUserLocation();
      if (!coords) {
        // if location is null (permission denied or error)
        return;
      }
      setUserLocation({ latitude: coords.latitude, longitude: coords.longitude });

      const locName = await getLocationNameFromCoords(coords.latitude, coords.longitude);
      setUserCurrLocName(locName);
    })();
  }, []);



  // Fetch user current location
  async function fetchUserLocation() {
    let { status } = await Location.requestForegroundPermissionsAsync();
    if (status !== 'granted') {
      console.error('Permission to access location was denied');
      return null;
    }

    let location = await Location.getCurrentPositionAsync({});
    return location.coords;
  }

  // Function to convert coordinates to a readable location name
  async function getLocationNameFromCoords(latitude, longitude) {
    const locationDetails = await Location.reverseGeocodeAsync({ latitude, longitude });
    if (locationDetails && locationDetails.length > 0) {
      console.log('User curr loc:', locationDetails[0].name, userLocation);
      return `${locationDetails[0].name}, ${locationDetails[0].street}, ${locationDetails[0].city}`;
    }
    Alert.alert('Location name not found');
    return 'Location name not found';
  }

  const search = async () => {
    const radius = searchDistance * 1000; // Convert km to meters

    try {
      const restaurants = await fetchAndPrepareRestaurants(
        'Burnaby, British Columbia, Canada', // later change the location
        searchKeyword,
        radius,
        searchRating
      );

      console.log('Search results:', restaurants);
      setSearchResults(restaurants);

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

})
