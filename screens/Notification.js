import { StyleSheet, Text, View, Button } from 'react-native'
import React from 'react'
import CommonStyles from '../styles/CommonStyles'
import { useNavigation } from '@react-navigation/native'

const Notification = () => {
  const navigation = useNavigation()

  return (
    <View style={[CommonStyles.container, { marginTop: 80 }]}>
      <Text>We will push you notifications here!</Text>
      <Button title="Go back" onPress={() => navigation.goBack()} />
    </View>
  )
}

export default Notification

const styles = StyleSheet.create({})