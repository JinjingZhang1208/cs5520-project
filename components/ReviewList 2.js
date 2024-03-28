import { FlatList, StyleSheet, Text, View } from 'react-native'
import React, { useEffect, useState } from 'react'
import {collection, onSnapshot, query, where, getDocs} from 'firebase/firestore';
import { database } from '../firebase-files/firebaseSetup';

import { auth } from '../firebase-files/firebaseSetup';
import ReviewItem from './ReviewItem';

export default function ReviewList() {
    const currentUser = auth.currentUser;
    const userId = currentUser.uid;

    const [reviews, setReviews] = useState([]);

    useEffect(() => {
        let q;
        q = query(collection(database, 'users', userId, 'reviews'));
        const unsub = onSnapshot(q, (querySnapshot) => {
            let items = [];
            querySnapshot.forEach((doc) => {
                items.push({...doc.data(), id: doc.id});
            });
            setReviews(items);
        });
        return () => unsub();
    },[]);

    return (
        <View>
            <FlatList
            data={reviews}
            renderItem={({item}) => (
                <ReviewItem review={item}/>
            )} />
        </View>
    )
}

const styles = StyleSheet.create({})