import { Image, Pressable, StyleSheet, Text, TextInput, View, FlatList, Dimensions } from 'react-native'
import React, { useEffect, useState } from 'react'
import CommonStyles from '../styles/CommonStyles'
import PressableButton from '../components/PressableButton'
import { updateDB, writeToDB } from '../firebase-files/databaseHelper';
import { uploadImageAsync, saveImageURLToFirestore } from '../firebase-files/databaseHelper';
import { auth, storage} from '../firebase-files/firebaseSetup';
import { MaterialIcons } from '@expo/vector-icons';
import ImageInput from '../components/ImageInput';
import * as Location from 'expo-location';

export default function Review({navigation, route}) {
    const [reviewContent, setReviewContent] = useState('');
    const [uploadedPhotos, setUploadedPhotos] = useState([]);
    const [imageURLs, setImageURLs] = useState([]);
    const [imageModalVisible, setImageModalVisible] = useState(false);

    const {mode, review} = route.params || {};
    const business_id = route.params.item?.bussiness_id || route.params.review?.bussiness_id;
    const restauntName = route.params.item?.name || route.params.review?.restaurantName;
    const location = route.params.item? {latitude: route.params.item.latitude, longitude: route.params.item.longitude}: route.params.review? {latitude: route.params.review.latitude, longitude: route.params.review.longitude}: {latitude: 37.78825, longitude: -122.4324};
    const [locationName, setLocationName] = useState(route.params.review?.locationName || 'Location Address');

    // Set initial location name
    useEffect(() => {
        async function fetchLocationName() {
            if (route.params.item) {
                const lat = route.params.item.latitude;
                const long = route.params.item.longitude;
                const name = await getLocationName(lat, long);
                setLocationName(name);
            }
        }
        fetchLocationName();
    }, []);

    async function getLocationName(lat, long) {
        const location = await Location.reverseGeocodeAsync({ latitude: lat, longitude: long });
        return `${location[0].name}, ${location[0].street}, ${location[0].city}`;;
    }

    // Set initial values for edit mode
    useEffect(() => {
        if (mode === 'edit') {
            setReviewContent(review.review);
            setImageURLs(review.imageURLs);
            setUploadedPhotos(review.imageURLs); // Set local state of image urls to display
        }
    }, [mode, review]);

    function receiveImageURI(imageUri) {
        setUploadedPhotos([...uploadedPhotos, imageUri]); // Set local state
        setImageModalVisible(false);
    };

    const updateReviewImageUrl = async(imageUri) => {
        try {
            const userId = auth.currentUser.uid;
            const imageUrl = await uploadImageAsync(imageUri); // Upload image and get URL
            setImageURLs([...imageURLs, imageUrl]); // Set local state
        } catch (error) {
            console.error(error);
        }
    }

    const deletePhoto = (index) => {
        const updatedPhotos = [...uploadedPhotos];
        updatedPhotos.splice(index, 1);
        setUploadedPhotos(updatedPhotos);

        const updatedImageURLs = [...imageURLs];
        updatedImageURLs.splice(index, 1);
        setImageURLs(updatedImageURLs);
    };

    async function submitHandler() {
        // code to submit review
        const currentUser = auth.currentUser;
        if (currentUser) {
            const userId = currentUser.uid;
            let newReview = {
                review: reviewContent, 
                bussiness_id: business_id,
                restaurantName: restauntName,
                locationName: locationName,
                latitude: location.latitude, 
                longitude: location.longitude,
                owner: userId,
                imageURLs: imageURLs,
            };

            writeToDB(newReview, 'allReviews'); // write to all reviews
            navigation.goBack();
        }
    }

    async function editHandler() {
        // code to edit review
        const currentUser = auth.currentUser;
        if (currentUser) {
            const userId = currentUser.uid;
            console.log('in edit:', route.params);
            let updatedReview = {
                review: reviewContent, 
                bussiness_id: business_id, 
                restaurantName: restauntName,
                locationName: locationName,
                latitude: location.latitude, 
                longitude: location.longitude, 
                owner: userId,
                imageURLs: imageURLs,
            };

            updateDB(updatedReview, 'allReviews', route.params.review.id); // update all reviews
            navigation.goBack();
        }
    }

    return (
        <View style={CommonStyles.container}>
            <View style={{marginTop:10, flexDirection: 'row'}}>
                {/* Add a button to open the image modal */}
                <View style={{alignSelf:'flex-start'}}>
                    <PressableButton
                        onPress={() => setImageModalVisible(true)}>
                        <MaterialIcons name="add-a-photo" size={40} color="black" />
                    </PressableButton>
                </View>

                {/* Render the uploaded photos */}
                <FlatList
                    data={uploadedPhotos}
                    renderItem={({ item, index }) => (
                        <View style={CommonStyles.uploadedPhotosContainer}>
                            <Image source={{ uri: item }} style={CommonStyles.uploadedPhoto} />
                            <Pressable onPress={() => deletePhoto(index)}>
                                <MaterialIcons name="delete" size={24} color="red" />
                            </Pressable>
                        </View>
                    )}
                    horizontal={true}/>
            
                {/* Add the ImageInput modal */}
                <ImageInput
                    imageModalVisible={imageModalVisible}
                    dismissModal={() => setImageModalVisible(false)}
                    receiveImageURI={receiveImageURI}
                    updateURI={updateReviewImageUrl}
                />
            </View>

            <View style={{marginTop:10}}> 
                {/* Add a text input for the review content */}
                <TextInput 
                    placeholder='Enter your review'
                    multiline={true}
                    style={[CommonStyles.reviewInput, {width: Dimensions.get('window').width * 0.98}]}
                    value={reviewContent}
                    onChangeText={setReviewContent}/>

                {/* Display the restaurant name */}
                <Text>🍽️{restauntName}</Text>
                        
                {/* Display the location name */}
                <Text>📍{locationName}</Text>

                {/* Add a button to submit the review */}
                <PressableButton 
                    customStyle={CommonStyles.pressableButtonStyle}
                    onPress={mode == 'edit'? editHandler:submitHandler}>
                    <Text>{mode == 'edit'? 'Update':'Submit'}</Text>
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
    },
})