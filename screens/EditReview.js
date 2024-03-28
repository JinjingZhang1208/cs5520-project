import { StyleSheet, Text, View } from 'react-native'
import React from 'react'
import AddReview from './AddReview'
import CommonStyles from '../styles/CommonStyles'

export default function EditReview() {
  return (
    <View style={CommonStyles.container}>
      <AddReview />
    </View>
  )
}

const styles = StyleSheet.create({})