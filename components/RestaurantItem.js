import { Pressable, StyleSheet, Text, View } from 'react-native'
import React from 'react'

import Card from './Card';
import CommonStyles from '../styles/CommonStyles';
import PressableButton from './PressableButton';

export default function RestaurantItem({item}) {
  return (
    <PressableButton>
      <Card cardStyle={CommonStyles.card}>
        <Text>{item.name}</Text>
        <Image 
          source={require('../assets/restaurant.jpeg')} 
          style={{width: 200, height: 100}} />
        <View style={[CommonStyles.directionRow, {justifyContent:'space-between'}]}>
          <Text>{item.rating}</Text>
          <Text>{item.numOfComments}</Text>
        </View>
      </Card>
    </PressableButton>
  )
}

const styles = StyleSheet.create({})