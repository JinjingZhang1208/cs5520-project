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

export default function Review({navigation, route}) {
    const [reviewContent, setReviewContent] = useState('');
    const [imageModalVisible, setImageModalVisible] = useState(false);
    const [uploadedPhotos, setUploadedPhotos] = useState([]);
    const [imageURLs, setImageURLs] = useState([]);
    const [location, setLocation] = useState({latitude: 37, longitude: -122}); // default location, later will be substituted with user's location
    const [locationName, setLocationName] = useState(null);

    const {mode, review} = route.params || {};

    // Set initial values for edit mode
    useEffect(() => {
        console.log('route.params in add review:', route.params);
        if (mode === 'edit') {
            setReviewContent(review.review);
            setUploadedPhotos(review.imageURLs);
            setImageURLs(review.imageURLs);
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
        console.log('!!!!:', route.params);
        if (currentUser) {
            const userId = currentUser.uid;
            let newReview = {
                review: reviewContent, 
                bussiness_id: route.params.item.bussiness_id,
                restaurantName: route.params.item.name,
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
                bussiness_id: route.params.review.bussiness_id, 
                restaurantName: route.params.review.restaurantName,
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

                {/* If in edit mode, display the restaurant name */}
                {mode == 'edit'? <Text>{route.params.review.restaurantName}</Text> :
                    <Text>{route.params.item.name}</Text>}
                {locationName && <Text>📍{locationName}</Text>}

                <PressableButton  
                    customStyle={styles.locationButtonStyle}
                    onPress={() => navigation.navigate('LocationManager', { mode: mode ,selectedLocation: location, review: review })}>
                    {console.log('Navigating to LocationManager with review:', review)}  
                    {console.log('Navigating to LocationManager with location:', location)}
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