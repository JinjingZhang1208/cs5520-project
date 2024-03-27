import React from 'react';
import { View, Text, Button } from 'react-native';
import RestaurantList from '../components/RestaurantList';

export default function Discover({ navigation }) {
  return (
    <View>
      <RestaurantList />
    </View>
  );
}

