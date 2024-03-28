import { Image, Pressable, StyleSheet, Text, View } from 'react-native'
import React from 'react'

import Card from './Card';
import CommonStyles from '../styles/CommonStyles';
import PressableButton from './PressableButton';
import { useNavigation } from '@react-navigation/native';

export default function RestaurantItem({item}) {

  const navigation = useNavigation();

  return (
    <PressableButton onPress={() => {navigation.navigate('Restaurant', {item: item})}}>
      <Card>
        <Text>{item.name}</Text>
        <Image 
          source={require('../assets/restaurant.jpeg')} 
          style={{width: 325, height: 100}} />
        <View style={[CommonStyles.directionRow, {justifyContent:'start'}]}>
          <Text>Ratings: {item.rating}   </Text>
          <Text>Reviews: {item.review_count}</Text>
        </View>
      </Card>
    </PressableButton>
  )
}

const styles = StyleSheet.create({})