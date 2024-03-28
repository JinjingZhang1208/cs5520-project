import { FlatList, StyleSheet, Text, View } from 'react-native'
import React, { useState, useEffect } from 'react'

import { collection, onSnapshot, query, where, getDocs } from 'firebase/firestore';
import { database } from '../firebase-files/firebaseSetup';
import RestaurantItem from './RestaurantItem';
import CommonStyles from '../styles/CommonStyles';

// Render the list of restaurants
function renderRestaurantsList(restaurants) {
    return (
        <View>
            <FlatList
            data={restaurants}
            renderItem={({item}) => (
                <RestaurantItem item={item}/>
            )} />
        </View>
    );
}

export default function RestaurantList({ fetchedRestaurants = [], collectionName }) {
    // If restaurants are passed as a prop, use them directly
    if (fetchedRestaurants.length > 0) {
        return renderRestaurantsList(fetchedRestaurants);
    }

    const [restaurants, setRestaurants] = useState([]);

    useEffect(() => {
        let q;
        q = query(collection(database, collectionName));
        const unsub = onSnapshot(q, (querySnapshot) => {
            let items = [];
            querySnapshot.forEach((doc) => {
                items.push({ ...doc.data(), id: doc.id });
            });
            setRestaurants(items);
        });
        return () => unsub();
    }, []);

    if (restaurants.length === 0) {
        if (collectionName === 'restaurants') {
            return (
                <View style={CommonStyles.centeredContainer}>
                    <Text style={CommonStyles.centeredText}>No restaurants found.</Text>
                </View>
            )
        } else {
            return (
                <View style={CommonStyles.centeredContainer}>
                    <Text style={CommonStyles.centeredText}>No restaurants in your wishlist.</Text>
                </View>
            )
        }
    }

    return (
        <View>
            <FlatList
                data={restaurants}
                renderItem={({ item }) => (
                    <RestaurantItem item={item} />
                )} />
        </View>
    )
}

const styles = StyleSheet.create({})