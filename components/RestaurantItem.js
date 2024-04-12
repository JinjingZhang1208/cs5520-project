import { Image, Pressable, StyleSheet, Text, View } from 'react-native'
import React from 'react'

import Card from './Card';
import CommonStyles from '../styles/CommonStyles';
import PressableButton from './PressableButton';
import { useNavigation } from '@react-navigation/native';

export default function RestaurantItem({item}) {

  const navigation = useNavigation();
  //console.log('item:', item.image_url);

  return (
    <PressableButton onPress={() => {navigation.navigate('Restaurant', {item: item})}}>
      <Card>
        <Text style={[CommonStyles.restauntName]}>{item.name}</Text>
        <Image 
          resizeMode='cover'
          source={{uri: item.image_url}}
          style={{width: 325, height: 150, borderRadius: 5}} />
        <View style={[CommonStyles.directionRow, {justifyContent:'start'}]}>
          {/* <Text>Ratings: {item.rating}   </Text>
          <Text>Reviews: {item.review_count}</Text> */}
        </View>
      </Card>
    </PressableButton>
  )
}

const styles = StyleSheet.create({})