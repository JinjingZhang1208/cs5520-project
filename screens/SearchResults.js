import { StyleSheet, Text, View } from 'react-native'
import React, { useEffect, useState } from 'react'
import { useNavigation, useRoute } from '@react-navigation/native'
import CommonStyles from '../styles/CommonStyles';
import RestaurantList from '../components/RestaurantList';
import { fetchAllRestaurantsFromDB, writeToDB } from '../firebase-files/databaseHelper';

const SearchResults = () => {
  const route = useRoute();
  const { results } = route.params;
  const [resultRestaurant, setResultRestaurant] = useState({
    data: results, // Initial data from search results
    savedInDB: []    // Track saved restaurants
  });


  // write resultRestaurant to the database if it doesn't exist
  useEffect(() => {
    const saveResults = async () => {
      try {
        const existingRestaurants = await fetchAllRestaurantsFromDB();
        const existingRestaurantNames = new Set(existingRestaurants.map(r => r.name.toLowerCase()));
        const resultRestaurantSavedInDB = [];

        for (const restaurant of resultRestaurant.data) {
          if (!existingRestaurantNames.has(restaurant.name.toLowerCase())) {
            await writeToDB(restaurant, 'restaurants');
          }
          resultRestaurantSavedInDB.push(restaurant);
        }

        setResultRestaurant(prevState => ({
          ...prevState,
          savedInDB: resultRestaurantSavedInDB
        })); 

      } catch (error) {
        console.error(error);
      }
    };

    saveResults();
  }
    , []);

  return (
    <View style={CommonStyles.container}>
      <View style={{ marginTop: 10 }}>
        <RestaurantList fetchedRestaurants={resultRestaurant.savedInDB} collectionName='restaurants' />
      </View>
    </View>
  )
}

export default SearchResults

const styles = StyleSheet.create({})