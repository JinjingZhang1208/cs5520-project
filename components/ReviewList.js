import { FlatList, StyleSheet, Text, View } from 'react-native'
import React, { useEffect, useState } from 'react'
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
