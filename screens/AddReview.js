import { Pressable, StyleSheet, Text, TextInput, View } from 'react-native'
import React, { useEffect, useState } from 'react'
import CommonStyles from '../styles/CommonStyles'
import PressableButton from '../components/PressableButton'
import { updateDB, writeToDB } from '../firebase-files/databaseHelper';
import { auth } from '../firebase-files/firebaseSetup';
import { MaterialIcons } from '@expo/vector-icons';
import ImageInput from '../components/ImageInput';

export default function Review({navigation, route}) {
    const [reviewContent, setReviewContent] = useState('');
    const [imageModalVisible, setImageModalVisible] = useState(false);
    const {mode, review} = route.params || {};

    //console.log('route.params here:', route.params.item);

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
            let newReview = {
                review: reviewContent, 
                bussiness_id: route.params.item.bussiness_id,
                restaurantName: route.params.item.name, 
                owner: userId};
            // writeToDB(newReview, 'users', userId, 'reviews'); // write to user's reviews
            writeToDB(newReview, 'allReviews'); // write to all reviews
            navigation.goBack();
        }
    }

    async function editHandler() {
        // code to edit review
        const currentUser = auth.currentUser;
        if (currentUser) {
            const userId = currentUser.uid;
            let updatedReview = {
                review: reviewContent, 
                bussiness_id: route.params.review.bussiness_id, 
                restaurantName: route.params.review.restaurantName,
                owner: userId
            };

            console.log('updatedReview:', updatedReview);
            // updateDB(updatedReview, 'users', userId, 'reviews', route.params.review.id);// update user's review
            updateDB(updatedReview, 'allReviews', route.params.review.id); // update all reviews
            navigation.goBack();
        }
    }

    function openImageModal() {
        setImageModalVisible(true);
    }

    function dismissModal() {
        setImageModalVisible(false);
    }

    return (
        <View style={CommonStyles.container}>
            <View style={{alignSelf:'flex-start'}}>
                <PressableButton
                    onPress={openImageModal}>
                    <MaterialIcons name="add-a-photo" size={40} color="black" />
                </PressableButton>
            </View>
            <ImageInput
                imageModalVisible={imageModalVisible}
                dismissModal={dismissModal}
            />
            <View style={{marginTop:10}}>   
                <TextInput 
                    placeholder='Enter your review'
                    style={CommonStyles.reviewInput}
                    value={reviewContent}
                    onChangeText={setReviewContent}/>
                {mode == 'edit'? <Text>{route.params.review.restaurantName}</Text> :
                    <Text>{route.params.item.name}</Text>}
                <PressableButton 
                    customStyle={styles.pressableButtonStyle}
                    onPress={mode == 'edit'? editHandler:submitHandler}>
                    <Text>Submit</Text>
                </PressableButton>
            </View>
        </View>
  )
}

const styles = StyleSheet.create({
    pressableButtonStyle: {
        backgroundColor: 'tomato',
        padding: 7,
        borderRadius: 10,
        marginTop: 5,
        width: 200,
        alignSelf: 'center'
    }
})