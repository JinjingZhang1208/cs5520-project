import React, { useEffect, useState } from 'react';
import { View, Text, Button, Alert } from 'react-native';
import RestaurantList from '../components/RestaurantList';
import CommonStyles from '../styles/CommonStyles';
import { fetchAndPrepareRestaurants } from '../services/YelpService';

export default function Discover({ navigation }) {
  const [restaurants, setRestaurants] = useState([]);

  useEffect(() => {
    const getRestaurants = async () => {
      try {
        const data = await fetchAndPrepareRestaurants();
        setRestaurants(data);
      } catch (error) {
        Alert.alert('Error', 'Unable to fetch restaurants.');
        console.error(error);
      }
    };

    getRestaurants();
  }, []);
  
  return (
    <View style={CommonStyles.container}>
      <View style={{marginTop:10}}>
        <RestaurantList fetchedRestaurants={restaurants} collectionName='restaurants'/>
      </View>
    </View>
  );
}

