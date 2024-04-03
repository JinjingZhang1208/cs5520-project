import { Pressable, StyleSheet, Text, TextInput, View } from 'react-native'
import React, { useEffect, useState } from 'react'
import CommonStyles from '../styles/CommonStyles'
import PressableButton from '../components/PressableButton'
import { updateDB, writeToDB } from '../firebase-files/databaseHelper';
import { auth } from '../firebase-files/firebaseSetup';
import LocationManager from '../components/LocationManager';

export default function Review({navigation, route}) {
    const [reviewContent, setReviewContent] = useState('');

    const {mode, review} = route.params || {};

    // Set initial values for edit mode
    useEffect(() => {
        if (mode === 'edit') {
            setReviewContent(review.review);
        }
    }, [mode, review]);

    async function submitHandler() {
        // code to submit review
        const currentUser = auth.currentUser;
        if (currentUser) {
            const userId = currentUser.uid;
            let newReview = {review: reviewContent, restaurantId: route.params.item.id, restaurantName: route.params.item.name};
            writeToDB(newReview, 'users', userId, 'reviews');
            navigation.goBack();
        }
    }

    async function editHandler() {
        // code to edit review
        const currentUser = auth.currentUser;
        if (currentUser) {
            const userId = currentUser.uid;
            let updatedReview = {review: reviewContent, restaurantId: route.params.review.restaurantId, restaurantName: route.params.review.restaurantName};
            updateDB(updatedReview, 'users', userId, 'reviews', route.params.review.id);
            navigation.goBack();
        }
    }

    return (
        <View style={CommonStyles.container}>
            <View style={{marginTop:10}}>   
                <TextInput 
                    placeholder='Enter your review'
                    style={CommonStyles.reviewInput}
                    value={reviewContent}
                    onChangeText={setReviewContent}/>
                {mode == 'edit'? <Text>{route.params.review.restaurantName}</Text> :
                    <Text>{route.params.item.name}</Text>}
                <LocationManager />
                <PressableButton 
                    onPress={mode == 'edit'? editHandler:submitHandler}>
                    <Text>Submit</Text>
                </PressableButton>
            </View>
        </View>
  )
}

const styles = StyleSheet.create({})