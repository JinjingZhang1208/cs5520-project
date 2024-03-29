import { StyleSheet, Text, View } from 'react-native'
import React from 'react'
import CommonStyles from '../styles/CommonStyles'

const Notification = () => {
  return (
    <View style={[CommonStyles.container, {marginTop: 80}]}>
      <Text>We will push you notifications here!</Text>
    </View>
  )
}

export default Notification

const styles = StyleSheet.create({})