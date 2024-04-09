import { Alert, Pressable, StyleSheet, Text, View } from 'react-native';
import React from 'react';
import { useNavigation } from '@react-navigation/native';
import PressableButton from './PressableButton';
import { MaterialIcons } from '@expo/vector-icons';
import { auth, database } from '../firebase-files/firebaseSetup';
import { deleteFromDB } from '../firebase-files/databaseHelper';

export default function ReviewItem({ review }) {

  const navigation = useNavigation();
  const currentUser = auth.currentUser;
  const userId = currentUser.uid;

  const reviewPressHandler = () => {
    navigation.navigate('Edit My Review', { review: review });
  }

  const deleteHandler = () => {
    Alert.alert('Delete', 'Are you sure you want to delete this review?', [
      { text: 'No', style: 'cancel' },
      {
        text: 'Yes', style: 'destructive',
        onPress: () => {
          console.log('Deleting review', review.id);
          // deleteFromDB('users', userId, 'reviews', review.id); // delete from user's reviews
          deleteFromDB('allReviews', review.id); // delete from all reviews
        }
      }
    ]);
  }

  return (
    <Pressable
      style={({ pressed }) => [styles.textContainer, pressed && styles.pressed]}
      onPress={reviewPressHandler} andriod_ripple={{ color: '#e9e' }}>

      <View style={{ flexDirection: 'column' }}>
        <Text style={styles.boldText}>{review.restaurantName}</Text>
        <Text style={styles.text}>{review.review}</Text>
      </View>

      {userId == review.owner && ( // only show delete button if the review belongs to the current user
        <PressableButton onPress={deleteHandler}>
          <MaterialIcons name="delete" size={24} color="black" />
        </PressableButton>
      )}
    </Pressable>
  )
}

const styles = StyleSheet.create({
  pressed: {
    opacity: 0.5,
  },
  textContainer: {
    borderRadius: 10,
    backgroundColor: "#FFF",
    width: "80%",
    marginTop: 15,
    marginBottom: 5,
    padding: 10,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 1,
  },
  text: {
    color: "#333",
    fontSize: 16,
    marginRight: 10,
  },

  boldText: {
    fontWeight: 'bold',
    fontSize: 18,
    color: "#000",
  },
  deleteButton: {
    padding: 8,
  },
});
