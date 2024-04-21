import { FlatList, StyleSheet, Text, View } from 'react-native'
import React, { useEffect, useState } from 'react'
import ReviewItem from './ReviewItem';

export default function ReviewList({ allReviews, myReview }) {
    if (myReview) {
        return (
            <FlatList
                data={allReviews}
                renderItem={({ item }) => (
                    <ReviewItem review={item} />
                )}
            />
        );
    } else {
        return (
            <View>
                {allReviews.map((review, index) => (
                    <ReviewItem key={index} review={review} />
                ))}
            </View>
        );
    }
}

const styles = StyleSheet.create({})
