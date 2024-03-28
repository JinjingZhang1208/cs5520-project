import { Pressable, StyleSheet, Text, View } from 'react-native';
import React from 'react';
import { useNavigation } from '@react-navigation/native';
import PressableButton from './PressableButton';
import { AntDesign } from '@expo/vector-icons';

export default function ReviewItem({item}) {

    const navigation = useNavigation();

    const reviewPressHandler = () => {
        navigation.navigate('Edit My Review', {review: item});
    }

    const deleteHandler = () => {
        console.log("Delete review with id: ", item.id);
    }
    
    return (
        <Pressable 
            style={({pressed})=> [styles.textContainer,pressed && styles.pressed]}
            onPress={reviewPressHandler} andriod_ripple={{color:'#e9e'}}>
            <View style={{flexDirection: 'column'}}>
                <Text style={{fontWeight: 'bold'}}>{item.restaurantName}</Text>
                <Text style={styles.text}>{item.review}</Text>
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