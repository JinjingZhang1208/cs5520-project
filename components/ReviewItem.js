import { Pressable, StyleSheet, Text, View } from 'react-native';
import React from 'react';
import { useNavigation } from '@react-navigation/native';
import PressableButton from './PressableButton';
import { AntDesign } from '@expo/vector-icons';

export default function ReviewItem({reviewObj}) {

    const navigation = useNavigation();

    const reviewPressHandler = () => {
        navigation.navigate('Review', {review: reviewObj});
    }
    
    return (
        <Pressable 
        style={({pressed})=> [styles.textContainer,pressed && styles.pressed]}
        onPress={reviewPressHandler} andriod_ripple={{color:'#e9e'}}>
            <View style={{flexDirection: 'column'}}>
                <Text style={styles.text}>{reviewObj.restaurantName}</Text>
                <Text style={styles.text}>{reviewObj.review}</Text>
            </View>
            <PressableButton onPressFunc={deleteHandler}>
                <AntDesign name="delete" size={24} color="black" />
            </PressableButton>
        </Pressable>
    )
}

const styles = StyleSheet.create({
    pressed: {
        opacity: 0.5,
    },

    textContainer: {
        borderRadius: 10,
        backgroundColor: "#aaa",
        marginTop: 15,
        flexDirection: "row",
        alignItems: "start",
      },
})