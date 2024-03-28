import { Alert, Image, StyleSheet, Text, View } from 'react-native'
import React, { useEffect, useState } from 'react'
import CommonStyles from '../styles/CommonStyles'
import PressableButton from '../components/PressableButton'
import { MaterialIcons } from '@expo/vector-icons';
import { auth, database } from '../firebase-files/firebaseSetup';
import { writeToDB, deleteFromDB } from '../firebase-files/databaseHelper';
import { doc, getDoc } from "firebase/firestore";
import Card from '../components/Card';

export default function RestaurantDetail({ navigation, route }) {
    const [bookmark, setBookmark] = useState(false);

    //check if the restaurant is in the wishlist
    useEffect(() => {
        checkIfInWishList();
    }, [bookmark]);

    async function checkIfInWishList() {
        const currentUser = auth.currentUser;
        if (currentUser) {
            const userId = currentUser.uid;
            const restaurantId = route.params.item.id;
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
            const restaurantId = route.params.item.id;

            try {
                if (bookmark) {
                    await deleteFromDB('users', userId, 'wishlists', restaurantId);
                    setBookmark(false);
                    Alert.alert('Removed from Wishlist');
                } else {
                    let res = {
                        restaurantId: restaurantId,
                        name: route.params.item.name,
                        rating: route.params.item.rating,
                        numOfComments: route.params.item.numOfComments,
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

    return (
        <View style={[{ marginTop: 10 }, CommonStyles.container]}>
            <Card>
                <Image
                    source={{ uri: route.params.item.image_url }}
                    style={{ width: 325, height: 100 }} />
                <View style={[CommonStyles.directionRow, { justifyContent: 'start' }]}>
                    <Text>Ratings: {route.params.item.rating}   </Text>
                    <Text>Reviews: {route.params.item.review_count}</Text>
                </View>
            </Card>
        </View>
    )
}

const styles = StyleSheet.create({})