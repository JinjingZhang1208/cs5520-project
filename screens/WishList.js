import { StyleSheet, Text, View } from 'react-native'
import React from 'react'

import RestaurantList from '../components/RestaurantList';
import { auth, database} from '../firebase-files/firebaseSetup';
import CommonStyles from '../styles/CommonStyles';

const WishList = () => {
  const currentUser = auth.currentUser;
  const userId = currentUser.uid;

  return (
  <View style={CommonStyles.container}>
      <View style={{marginTop:10}}>
        <RestaurantList collectionName={`users/${userId}/wishlists`} />
      </View>
    </View>
)
}

export default WishList

const styles = StyleSheet.create({})