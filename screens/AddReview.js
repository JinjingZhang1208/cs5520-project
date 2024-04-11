import { Pressable, StyleSheet, Text, TextInput, View } from 'react-native'
import React, { useEffect, useState } from 'react'
import CommonStyles from '../styles/CommonStyles'
import PressableButton from '../components/PressableButton'
import { updateDB, writeToDB } from '../firebase-files/databaseHelper';
import { auth } from '../firebase-files/firebaseSetup';
import * as Location from 'expo-location';

export default function Review({navigation, route}) {
    const [reviewContent, setReviewContent] = useState('');
    const {mode, review} = route.params || {};
    const [location, setLocation] = useState({
        latitude: route.params.review?.latitude? route.params.review.latitude: 37.78825,
        longitude: route.params.review?.longitude? route.params.review.longitude: -122.4324
    });
    const [locationName, setLocationName] = useState(null);
    
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
    

    // Set initial values for edit mode
    useEffect(() => {
        console.log('route.params in add review:', route.params);
        if (mode === 'edit') {
            setReviewContent(review.review);
        }
        // set location name
        updateLocationName();
    }, [mode, review, route.params.selectedLocation]);

    async function submitHandler() {
        // code to submit review
        const currentUser = auth.currentUser;
        console.log('!!!!:', route.params);
        if (currentUser) {
            const userId = currentUser.uid;
            let newReview = {
                review: reviewContent, 
                bussiness_id: route.params.item?.bussiness_id? route.params.item.bussiness_id: route.params.restaurantInfo.restaurantId, // either from RestaurantDetail or naviagte back from Map
                restaurantName: route.params.item?.name? route.params.item.name: route.params.restaurantInfo.restaurantName, // either from RestaurantDetail or naviagte back from Map
                locationName: locationName,
                latitude: location.latitude, // for map initial location
                longitude: location.longitude, // for map initial location
                owner: userId
            };
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
                locationName: route.params.review.locationName? route.params.review.locationName: locationName,
                latitude: route.params.review.latitude? route.params.review.latitude: location.latitude, // for map initial location
                longitude: route.params.review.longitude? route.params.review.longitude: location.longitude, // for map initial location
                owner: userId
            };

            console.log('updatedReview:', updatedReview);
            // updateDB(updatedReview, 'users', userId, 'reviews', route.params.review.id);// update user's review
            updateDB(updatedReview, 'allReviews', route.params.review.id); // update all reviews
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
                    {console.log('bug here:', route.params)}

                    <Text>🍽️{ 
                        route.params.item?.name || 
                        route.params.review?.restaurantName || 
                        route.params.restaurantInfo?.restaurantName 
                    }</Text>

                {locationName && <Text>📍{locationName}</Text>}

                <PressableButton  
                    customStyle={styles.locationButtonStyle}
                    onPress={() => navigation.navigate('LocationManager', { 
                        mode: mode ,
                        selectedLocation: location, 
                        review: review, 
                        restaurantInfo: {
                            restaurantName: route.params.item?.name? route.params.item.name: route.params.review.restaurantName,
                            restaurantId: route.params.item?.bussiness_id? route.params.item.bussiness_id: route.params.review.bussiness_id
                            } })
                            }>
                    {console.log('Navigating to LocationManager with review:', review)}  
                    {console.log('Navigating to LocationManager with location:', location)}
                    <Text>Choose Location</Text>
                </PressableButton>

                <PressableButton 
                    customStyle={styles.pressableButtonStyle}
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