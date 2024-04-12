import { Image, Pressable, StyleSheet, Text, TextInput, View, FlatList } from 'react-native'
import React, { useEffect, useState } from 'react'
import CommonStyles from '../styles/CommonStyles'
import PressableButton from '../components/PressableButton'
import { updateDB, writeToDB } from '../firebase-files/databaseHelper';
import { uploadImageAsync, saveImageURLToFirestore } from '../firebase-files/databaseHelper';
import { auth, storage} from '../firebase-files/firebaseSetup';
import * as Location from 'expo-location';
import { MaterialIcons } from '@expo/vector-icons';
import ImageInput from '../components/ImageInput';
import { useRoute } from '@react-navigation/native';

export default function Review({navigation, route}) {

    const [reviewContent, setReviewContent] = useState('');
    const [uploadedPhotos, setUploadedPhotos] = useState([]);
    const [imageURLs, setImageURLs] = useState([]);
    const [imageModalVisible, setImageModalVisible] = useState(false);
    const [location, setLocation] = useState({
        latitude: route.params.review?.latitude? route.params.review.latitude: 42.339904,
        longitude: route.params.review?.longitude? route.params.review.longitude: 71.0924641,17
    });
    const [locationName, setLocationName] = useState(null);

    const {mode, review} = route.params || {};
    const business_id = route.params.item?.bussiness_id || route.params.review?.bussiness_id;
    const restauntName = route.params.item?.name || route.params.review?.restaurantName;

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

    const updateLocationName = async () => {
        if (route.params.selectedLocation) {
            setLocation(route.params.selectedLocation);
            const lat = route.params.selectedLocation.latitude;
            const long = route.params.selectedLocation.longitude;
            const name = await getLocationName(lat, long);
            setLocation(route.params.selectedLocation);
            setLocationName(name);
        }
    }

    async function getLocationName(lat, long) {
        const location = await Location.reverseGeocodeAsync({ latitude: lat, longitude: long });
        return `${location[0].name}, ${location[0].street}, ${location[0].city}`;

    }

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
                latitude: location.latitude, // for map initial location
                longitude: location.longitude, // for map initial location
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
            let updatedReview = {
                review: reviewContent, 
                bussiness_id: business_id, 
                restaurantName: restauntName,
                locationName: route.params.review.locationName? route.params.review.locationName: locationName,
                latitude: route.params.review.latitude? route.params.review.latitude: location.latitude, // for map initial location
                longitude: route.params.review.longitude? route.params.review.longitude: location.longitude, // for map initial location
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
            </View>
            
            {/* Add the ImageInput modal */}
            <ImageInput
                imageModalVisible={imageModalVisible}
                dismissModal={() => setImageModalVisible(false)}
                receiveImageURI={receiveImageURI}
                updateURI={updateReviewImageUrl}
            />

            <View style={{marginTop:10}}> 
                {/* Add a text input for the review content */}
                <TextInput 
                    placeholder='Enter your review'
                    style={CommonStyles.reviewInput}
                    value={reviewContent}
                    onChangeText={setReviewContent}/>

                {/* Display the restaurant name */}

                    <Text>🍽️{ 
                        restauntName || 
                        route.params.restaurantInfo?.restaurantName 
                    }</Text>

                {locationName && <Text>📍{locationName}</Text>}

                <PressableButton  
                    customStyle={styles.locationButtonStyle}
                    onPress={() => navigation.navigate('LocationManager', { 
                        // mode: mode ,
                        location: location, 
                        // review: review, 
                        // restaurantInfo: {
                        //     restaurantName: route.params.item?.name? route.params.item.name: route.params.review.restaurantName,
                        //     restaurantId: route.params.item?.bussiness_id? route.params.item.bussiness_id: route.params.review.bussiness_id
                        //     } 
                        })}>
                    {/* {console.log('Navigating to LocationManager with review:', review)}  
                    {console.log('Navigating to LocationManager with location:', location)} */}
                    <Text>Choose Location</Text>
                </PressableButton>

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
        alignSelf: 'center'
    },
    locationButtonStyle: {
        backgroundColor: 'lightblue',
        padding: 7,
        borderRadius: 10,
        marginTop: 5,
        width: 200,
        alignSelf: 'center'
    }
})