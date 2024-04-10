import { Image, Pressable, StyleSheet, Text, TextInput, View } from 'react-native'
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
    const [uploadedPhotos, setUploadedPhotos] = useState([]);
    const {mode, review} = route.params || {};

    // Set initial values for edit mode
    useEffect(() => {
        if (mode === 'edit') {
            setReviewContent(review.review);
        }
    }, [mode, review]);

    const receiveImageURI = (uri) => {
        setUploadedPhotos([...uploadedPhotos, uri]);
        setImageModalVisible(false);
    };

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

            updateDB(updatedReview, 'allReviews', route.params.review.id); // update all reviews
            navigation.goBack();
        }
    }

    return (
        <View style={CommonStyles.container}>
            {/* Add a button to open the image modal */}
            <View style={{alignSelf:'flex-start', marginLeft: 60}}>
                <PressableButton
                    onPress={() => setImageModalVisible(true)}>
                    <MaterialIcons name="add-a-photo" size={40} color="black" />
                </PressableButton>
            </View>

            {/* Render the uploaded photos */}
            <View style={CommonStyles.uploadedPhotosContainer}>
                {uploadedPhotos.map((uri, index) => (
                    <Image key={index} source={{ uri: uri }} style={CommonStyles.uploadedPhoto} />
                ))}
            </View>
            
            {/* Add the ImageInput modal */}
            <ImageInput
                imageModalVisible={imageModalVisible}
                dismissModal={() => setImageModalVisible(false)}
                receiveImageURI={receiveImageURI}
            />

            <View style={{marginTop:10}}> 
                {/* Add a text input for the review content */}
                <TextInput 
                    placeholder='Enter your review'
                    style={CommonStyles.reviewInput}
                    value={reviewContent}
                    onChangeText={setReviewContent}/>

                {/* If in edit mode, display the restaurant name */}
                {mode == 'edit'? <Text>{route.params.review.restaurantName}</Text> :
                    <Text>{route.params.item.name}</Text>}

                {/* Add a button to submit the review */}
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