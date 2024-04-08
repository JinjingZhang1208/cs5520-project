import { StyleSheet, Text, View } from 'react-native'
import React, {useState} from 'react'
import { useNavigation, useRoute } from '@react-navigation/native'
import CommonStyles from '../styles/CommonStyles';
import RestaurantList from '../components/RestaurantList';

const SearchResults = () => {
  const route = useRoute(); 
  const { results } = route.params;
  const [resultRestaurant, setResultRestaurant] = useState(results);

  return (
    <View style={CommonStyles.container}>
      <View style={{ marginTop: 10 }}>
        <RestaurantList fetchedRestaurants={resultRestaurant} />
      </View>
    </View>
  )
}

export default SearchResults

const styles = StyleSheet.create({})