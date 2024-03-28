import { StyleSheet, Text, View } from 'react-native'
import React from 'react'
import ReviewList from '../components/ReviewList'
import CommonStyles from '../styles/CommonStyles'

export default function MyReviews() {
  return (
    <View style={CommonStyles.container}>
      <ReviewList />
    </View>
  )
}

const styles = StyleSheet.create({})