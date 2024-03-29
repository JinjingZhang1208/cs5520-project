import { StyleSheet, Text, View } from 'react-native'
import React from 'react'
import AddReview from './AddReview'
import CommonStyles from '../styles/CommonStyles'

export default function EditReview({navigation, route}) {
  return (
    <View style={[CommonStyles.container, styles.containerExtended]}>
      <AddReview 
        navigation={navigation} 
        route={{params: {mode: 'edit', review: route.params.review}}}/>
    </View>
  )
}


const styles = StyleSheet.create({
  containerExtended: {
    marginTop: 20,
    padding: 10,
  },
  header: {
    fontSize: 24,
    fontWeight: 'bold',
    textAlign: 'center',
    marginVertical: 20,
  },
  backButton: {
    position: 'absolute',
    top: 40,
    left: 10,
    padding: 10,
  }
});