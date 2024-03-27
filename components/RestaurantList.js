import { FlatList, StyleSheet, Text, View } from 'react-native'
import React, { useState, useEffect } from 'react'

import {collection, onSnapshot, query, where, getDocs} from 'firebase/firestore';
import { database } from '../firebase-files/firebaseSetup';
import RestaurantItem from './RestaurantItem';

export default function RestaurantList() {
    const [restaurants, setRestaurants] = useState([]);

    useEffect(() => {
        let q;
        q = query(collection(database, 'restaurants'));
        const unsub = onSnapshot(q, (querySnapshot) => {
            let items = [];
            querySnapshot.forEach((doc) => {
                items.push({...doc.data(), id: doc.id});
            });
            setRestaurants(items);
        });
        return () => unsub();
    },[]);

    return (
        <View>
            <FlatList
            data={restaurants}
            renderItem={({item}) => (
                <RestaurantItem item={item}/>
            )} />
        </View>
    )
}

const styles = StyleSheet.create({})