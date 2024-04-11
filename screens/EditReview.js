import { StyleSheet, Text, View } from 'react-native'
import React from 'react'
import AddReview from './AddReview'
import CommonStyles from '../styles/CommonStyles'

export default function EditReview({navigation, route}) {
  console.log('route.params in edit review:', route.params);
  return (
      <AddReview 
        navigation={navigation} 
        route={{params: {mode: 'edit', review: route.params.review}}}/>
  )
}


const styles = StyleSheet.create({});