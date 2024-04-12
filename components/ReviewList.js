import { FlatList, StyleSheet, Text, View } from 'react-native'
import React, { useEffect, useState } from 'react'
import { collection, onSnapshot, query } from 'firebase/firestore';
import { database } from '../firebase-files/firebaseSetup';

import { auth } from '../firebase-files/firebaseSetup';
import ReviewItem from './ReviewItem';

export default function ReviewList({ allReviews }) {

    return (
        <View>
            <FlatList
                data={allReviews}
                renderItem={({ item }) => (
                    <ReviewItem review={item} />
                )}
            />
        </View>
    )
}

const styles = StyleSheet.create({})
