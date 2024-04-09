import { FlatList, StyleSheet, Text, View } from 'react-native'
import React, { useEffect, useState } from 'react'
import { collection, onSnapshot, query } from 'firebase/firestore';
import { database } from '../firebase-files/firebaseSetup';

import { auth } from '../firebase-files/firebaseSetup';
import ReviewItem from './ReviewItem';

export default function ReviewList(allReviews = {}) {
    const currentUser = auth.currentUser;
    const userId = currentUser.uid;

    const [reviews, setReviews] = useState([]);
    const [useAllReviews, setUseAllReviews] = useState(false);


    useEffect(() => {
        if (allReviews.allReviews) {
            setUseAllReviews(true);
        } else {
            const q = query(collection(database, 'users', userId, 'reviews'));
            const unsub = onSnapshot(q, (querySnapshot) => {
                let items = [];
                querySnapshot.forEach((doc) => {
                    items.push({ ...doc.data(), id: doc.id });
                });
                setReviews(items);
            });
            return () => unsub();
        }
    }, [allReviews, userId]);
    

    return (
        <View>
            {useAllReviews ? (
                <FlatList
                    data={allReviews.allReviews}
                    renderItem={({ item }) => (
                        <ReviewItem review={item} />
                    )}
                />
            ) : (
                <FlatList
                    data={reviews}
                    renderItem={({ item }) => (
                        <ReviewItem review={item} />
                    )}
                />
            )}
        </View>
    )
}

const styles = StyleSheet.create({})
