import { StyleSheet, Text, View } from 'react-native'
import React from 'react'

import Card from './Card';
import CommonStyles from '../styles/CommonStyles';

export default function RestaurantItem() {
  return (
    <Card cardStyle={CommonStyles.card}>
      <Text>Restaurant Name</Text>
      {/* <Image 
        source={require('../assets/restaurant.jpg')} 
        style={{width: 200, height: 100}} /> */}
      <View style={[CommonStyles.directionRow, {justifyContent:'space-between'}]}>
        <Text>Rating</Text>
        <Text>Comments</Text>
        <Text>Price</Text>
      </View>
    </Card>
  )
}

const styles = StyleSheet.create({})