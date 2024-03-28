import { StyleSheet, Text, View } from 'react-native'
import React from 'react'
import AddReview from './AddReview'
import CommonStyles from '../styles/CommonStyles'

export default function EditReview({navigation, route}) {
  return (
    <View style={CommonStyles.container}>
      <AddReview 
        navigation={navigation} 
        route={{params: {mode: 'edit', review: route.params.review}}}/>
    </View>
  )
}

const styles = StyleSheet.create({})