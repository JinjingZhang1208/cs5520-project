import { Alert, Image, Pressable, StyleSheet, Text, View } from 'react-native'
import React, { useEffect, useState } from 'react'
import CommonStyles from '../styles/CommonStyles'
import PressableButton from '../components/PressableButton'
import { MaterialIcons } from '@expo/vector-icons';
import { auth, database } from '../firebase-files/firebaseSetup';
import { writeToDB, deleteFromDB, readMyReviewsFromDB, readOtherReviewsFromDB } from '../firebase-files/databaseHelper';
import { doc, getDoc } from "firebase/firestore";
import Card from '../components/Card';
import ReviewList from '../components/ReviewList';
import * as Linking from "expo-linking";


export default function RestaurantDetail({ navigation, route }) {
    const [bookmark, setBookmark] = useState(false);
    const [myReviews, setMyReviews] = useState([]);
    const [otherReviews, setOtherReviews] = useState([]);

    //get restaurant details from the route params
    const restaurantId = route.params.item.bussiness_id;
    const name = route.params.item.name;
    const rating = route.params.item.rating;
    const review_count = route.params.item.review_count;
    const image_url = route.params.item.image_url;
    const latitude = route.params.item.latitude;
    const longitude = route.params.item.longitude;
    const address = route.params.item.address;
    const phone = route.params.item.phone;
    const price = route.params.item.price;
    const menu = route.params.item.menu;

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
                        name: name,
                        rating: rating,
                        review_count: review_count,
                        image_url: image_url,
                        owner: userId,
                        latitude: latitude,
                        longitude: longitude,
                        address: address,
                        phone: phone,
                        price: price,
                        menu: menu
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
        async function fetchMyReviewsData() {
            const reviews = await readMyReviewsFromDB(restaurantId);
            setMyReviews(reviews);
        }
        fetchMyReviewsData();
    }, [myReviews]);

    //fetch reviews for the restaurant use rea
    useEffect(() => {
        async function fetchOtherReviewsData() {
            const reviews = await readOtherReviewsFromDB(restaurantId);
            setOtherReviews(reviews);
            //console.log('otherReviews:', reviews);
        }
        fetchOtherReviewsData();
    }, [otherReviews]);

    const handleMenuPress = () => {
        Linking.openURL(menu);
    };

    return (
        <View style={[{ marginTop: 10 }, CommonStyles.restaurantContainer]}>
            <Card>
                <View style={{ justifyContent: 'center', alignItems: 'center' }}>
                    <Image
                        source={{ uri: image_url}}
                        style={{ width: 300, height: 100 }} />
                </View>
                <View style={{ justifyContent: 'flex-start', alignItems: 'flex-start' }}>
                    <View style={[CommonStyles.directionRow, { justifyContent: 'center' }]}>
                        <Text>Ratings: {rating}   </Text>
                        <Text>Reviews: {review_count}</Text>
                    </View>
                    <Text>Address: {address} </Text>
                    <Text>Phone: {phone} </Text>
                    <Text>Price: {price} </Text>
                    <Pressable onPress={handleMenuPress}>
                        <Text>
                            <Text style={{ color: 'black' }}>Menu: </Text>
                            <Text style={{ color: 'blue', textDecorationLine: 'underline' }}>{menu}</Text>
                        </Text>
                    </Pressable>
                    <PressableButton
                        customStyle={styles.pressableButtonStyle}
                        onPress={() => { navigation.navigate('Add My Review', {item: route.params.item})}}>
                        <Text>Add my Review</Text>
                    </PressableButton>
                </View>
            </Card>
            <Card>
                <View>
                    <View style={{ marginBotton: 5}}>
                        <Text style={{ fontSize: 15, fontWeight: 'bold'}}>My Reviews</Text>
                        <ReviewList allReviews={myReviews} /> 
                    </View>
                    <View style={{ marginBotton: 5}}>
                        {otherReviews != [] && <Text style={{ fontSize: 15, fontWeight: 'bold' }}>Other Reviews</Text>}
                        <ReviewList allReviews={otherReviews} />
                    </View>
                </View>
            </Card>
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