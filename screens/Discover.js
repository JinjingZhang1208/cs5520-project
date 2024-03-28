import React from 'react';
import { View, Text, Button } from 'react-native';
import RestaurantList from '../components/RestaurantList';
import CommonStyles from '../styles/CommonStyles';

export default function Discover({ navigation }) {
  return (
    <View style={CommonStyles.container}>
      <View style={{marginTop:10}}>
        <RestaurantList collectionName='restaurants'/>
      </View>
    </View>
  );
}

