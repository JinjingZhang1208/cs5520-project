import { StyleSheet, Text, View } from 'react-native'
import React, { useState, useEffect } from 'react'
import ReviewList from '../components/ReviewList'
import CommonStyles from '../styles/CommonStyles'
import { readUserReviewsFromDB } from '../firebase-files/databaseHelper'

import { auth } from '../firebase-files/firebaseSetup'

export default function MyReviews() {
  const [reviews, setReviews] = useState([]);
  const userId = auth.currentUser.uid;

  // fetch user reviews by userId
  useEffect(() => {
    async function fetchUserReviews() {
      const userReviews = await readUserReviewsFromDB(userId);
      setReviews(userReviews);
    }
    fetchUserReviews();
  }
    , [reviews]);


  return (
    <View style={CommonStyles.container}>
      <ReviewList allReviews={reviews} myReview={true}/>
    </View>
  )
}

const styles = StyleSheet.create({})