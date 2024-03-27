import { Image, StyleSheet, Text, View } from 'react-native'
import React, { useEffect, useState } from 'react'
import CommonStyles from '../styles/CommonStyles'
import PressableButton from '../components/PressableButton'
import { MaterialIcons } from '@expo/vector-icons';

export default function RestaurantDetail({navigation, route}) {
    const [bookmark, setBookmark] = useState(false);

    const addToWishList = () => {
        setBookmark(!bookmark);
    }

    //set header right to a button that adds the restaurant to the wishlist
    useEffect (() => { 
        navigation.setOptions({
            headerRight: () => (
                <PressableButton onPress={addToWishList}>
                    {bookmark? <MaterialIcons name="bookmark-added" size={24} color="black" /> :
                    <MaterialIcons name="bookmark-add" size={24} color="black" />}
                </PressableButton>
            )
        });   
    },[bookmark]);

    return (
        <View style={[{marginTop: 10}, CommonStyles.container]}>
        <Image 
            source={require('../assets/restaurant.jpeg')} 
            style={{width: 325, height: 100}} />
        </View>
    )
}

const styles = StyleSheet.create({})