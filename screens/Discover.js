import React, { useEffect, useState } from 'react';
import { View, Text, Button, Alert } from 'react-native';
import RestaurantList from '../components/RestaurantList';
import CommonStyles from '../styles/CommonStyles';
import { fetchAndPrepareRestaurants } from '../services/YelpService';
import { writeToDB, fetchAllRestaurantsFromDB } from '../firebase-files/databaseHelper';

export default function Discover({ navigation }) {
  const [restaurants, setRestaurants] = useState([]);

  useEffect(() => {
    // Fetch and prepare restaurants from Yelp
    const getRestaurants = async () => {
      try {
        const newYelpData = await fetchAndPrepareRestaurants();
        const existingRestaurants = await fetchAllRestaurantsFromDB();
        console.log('existingRestaurants', existingRestaurants);
        console.log('newYelpData', newYelpData);
        const existingRestaurantNames = new Set(existingRestaurants.map(r => r.name.toLowerCase()));

        // if the restaurant is not in the database, write it
        for (const restaurant of newYelpData) {
          if (!existingRestaurantNames.has(restaurant.name.toLowerCase())) {
            await writeToDB(restaurant, 'restaurants');
            existingRestaurantNames.add(restaurant.name.toLowerCase());
          }
        }

        // setRestaurants([...existingRestaurants, ...newYelpData.filter(r => existingRestaurantNames.has(r.name.toLowerCase()))]);
        setRestaurants(existingRestaurantNames);
      } catch (error) {
        Alert.alert('Error', 'Unable to fetch or write restaurants.');
        console.error(error);
      }
    };

    getRestaurants();
  }, []);

  return (
    <View style={CommonStyles.container}>
      <View style={{ marginTop: 10 }}>
        <RestaurantList fetchedRestaurants={restaurants} collectionName='restaurants' />
      </View>
    </View>
  );
}

