import { Alert, Image, StyleSheet, Text, View } from 'react-native'
import React, { useEffect, useState } from 'react'
import CommonStyles from '../styles/CommonStyles'
import PressableButton from '../components/PressableButton'
import { MaterialIcons } from '@expo/vector-icons';
import { auth, database } from '../firebase-files/firebaseSetup';
import { writeToDB, deleteFromDB, readAllReviewsFromDB } from '../firebase-files/databaseHelper';
import { doc, getDoc } from "firebase/firestore";
import Card from '../components/Card';
import { fetchReviews } from '../services/YelpService';
import ReviewList from '../components/ReviewList';


export default function RestaurantDetail({ navigation, route }) {
    const [bookmark, setBookmark] = useState(false);
    const [reviews, setReviews] = useState([]);

    const restaurantId = route.params.item.bussiness_id;

    //check if the restaurant is in the wishlist
    useEffect(() => {
        checkIfInWishList();
    }, [bookmark]);

    async function checkIfInWishList() {
        const currentUser = auth.currentUser;
        if (currentUser) {
            const userId = currentUser.uid;
            const docRef = doc(database, 'users', userId, 'wishlists', restaurantId);
            const docSnap = await getDoc(docRef);

            try {
                if (docSnap.exists()) {
                    setBookmark(true);
                }
            } catch (error) {
                console.error('Error checking wishlist:', error);
            }
        }
    }

    //add or remove the restaurant from the wishlist
    async function wishlistHandler() {
        const currentUser = auth.currentUser;
        if (currentUser) {
            const userId = currentUser.uid;

            try {
                if (bookmark) {
                    await deleteFromDB('users', userId, 'wishlists', restaurantId);
                    setBookmark(false);
                    Alert.alert('Removed from Wishlist');
                } else {
                    let res = {
                        bussiness_id: restaurantId,
                        name: route.params.item.name,
                        rating: route.params.item.rating,
                        review_count: route.params.item.review_count,
                        image_url: route.params.item.image_url,
                        owner: userId,
                    };
                    await writeToDB(res, 'users', userId, 'wishlists');
                    setBookmark(true);
                    Alert.alert('Added to Wishlist');
                }
            } catch (error) {
                console.error('Error adding to wishlist:', error);
            }
        }
    }

    //set header right to a button that adds the restaurant to the wishlist
    useEffect(() => {
        navigation.setOptions({
            headerRight: () => (
                <PressableButton onPress={wishlistHandler}>
                    {bookmark ? <MaterialIcons name="bookmark-added" size={24} color="black" /> :
                        <MaterialIcons name="bookmark-add" size={24} color="black" />}
                </PressableButton>
            )
        });
    }, [bookmark]);

    //fetch reviews for the restaurant use readAllReviewsFromDB
    useEffect(() => {
        async function fetchReviewsData() {
            //console.log('Reviews params:', route.params);
            const reviews = await readAllReviewsFromDB(route.params.item.bussiness_id);
            setReviews(reviews);
            //console.log('reviews:', reviews);
        }
        fetchReviewsData();
    }, [reviews]);


    return (
        <View style={[{ marginTop: 10 }, CommonStyles.restaurantContainer]}>
            <Card>
                <View style={{ justifyContent: 'center', alignItems: 'center' }}>
                    <Image
                        source={{ uri: route.params.item.image_url }}
                        style={{ width: 325, height: 150 }} />
                </View>
                <View style={[CommonStyles.directionRow, { justifyContent: 'center' }]}>
                    {/* <Text>Ratings: {route.params.item.rating}   </Text>
                    <Text>Reviews: {route.params.item.review_count}</Text> */}
                </View>
                <PressableButton
                    customStyle={styles.pressableButtonStyle}
                    onPress={() => { navigation.navigate('Add My Review', { item: route.params.item }) }}>
                    <Text>Add my Review</Text>
                </PressableButton>
            </Card>

            <ReviewList allReviews={reviews} />

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