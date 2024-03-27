import { Image, Pressable, StyleSheet, Text, View } from 'react-native'
import React from 'react'

import Card from './Card';
import CommonStyles from '../styles/CommonStyles';
import PressableButton from './PressableButton';

export default function RestaurantItem({item}) {
  return (
    <PressableButton>
      <Card>
        <Text>{item.name}</Text>
        <Image 
          source={require('../assets/restaurant.jpeg')} 
          style={{width: 325, height: 100}} />
        <View style={[CommonStyles.directionRow, {justifyContent:'start'}]}>
          <Text>ratings: {item.rating} </Text>
          <Text>comments: {item.numOfComments}</Text>
        </View>
      </Card>
    </PressableButton>
  )
}

const styles = StyleSheet.create({})