import { Alert, Pressable, StyleSheet, Text, View, Image } from 'react-native';
import React, { useState, useEffect } from 'react';
import { useNavigation } from '@react-navigation/native';
import PressableButton from './PressableButton';
import { MaterialIcons } from '@expo/vector-icons';
import { auth, database } from '../firebase-files/firebaseSetup';
import { deleteFromDB } from '../firebase-files/databaseHelper';
import { fetchUserData } from '../firebase-files/databaseHelper';
import Card from './Card';
import CommonStyles from '../styles/CommonStyles';

export default function ReviewItem({ review }) {

  const navigation = useNavigation();
  const currentUser = auth.currentUser;
  const userId = currentUser.uid;
  const [otherUserName, setOtherUserName] = useState('');
  const [avatarUrl, setAvatarUrl] = useState('');


  useEffect(() => {
    const fetchNameAndAvatar = async () => {
      const userData = await fetchUserData(review.owner);
      if (userData) {
        setOtherUserName(userData.username || '');
        setAvatarUrl(userData.avatarUrl || '');
      }
    };

    fetchNameAndAvatar();
  }, [review.owner]);

  const getOtherUserName = async () => {
    const userData = await fetchUserData(review.owner);
    return userData;
  }


  const renderImages = (imageURLs) => {
    return imageURLs.map((url, index) => (
      <Image key={index} source={{ uri: url }} style={styles.reviewImage} resizeMode="cover" />
    ));
  };

  const reviewPressHandler = () => {
    if (review.owner == userId) {
      navigation.navigate('Edit My Review', { review: review });
    }
  }

  const deleteHandler = () => {
    Alert.alert('Delete', 'Are you sure you want to delete this review?', [
      { text: 'No', style: 'cancel' },
      {
        text: 'Yes', style: 'destructive',
        onPress: () => {
          console.log('Deleting review', review.id);
          deleteFromDB('allReviews', review.id); // delete from all reviews
        }
      }
    ]);
  }

  return (
    // if the review belongs to the user, wrap it in pressable to navigate to edit screen,
    // otherwise, just show the review
    <>
      {review.owner == userId && (
        <Pressable
          style={({ pressed }) => [styles.textContainer, pressed && styles.pressed]}
          onPress={reviewPressHandler} andriod_ripple={{ color: '#e9e' }}>

          <View style={{ flexDirection: 'column' }}>
            <Text style={styles.boldText}>{review.restaurantName}</Text>
            {review.imageURLs && review.imageURLs.length > 0 && (
              <View style={styles.imagesContainer}>
                {renderImages(review.imageURLs)}
              </View>
            )}
            <Text style={styles.text}>{review.review}</Text>
          </View>

          <PressableButton onPress={deleteHandler}>
            <MaterialIcons name="delete" size={24} color="black" />
          </PressableButton>
        </Pressable>
      )}

      {console.log('review owner:', review)}

      {review.owner != userId && <Card style={styles.textContainer}>
        <Text style={styles.boldText}>{review.restaurantName}</Text>
        {review.imageURLs && review.imageURLs.length > 0 && (
          <View style={styles.imagesContainer}>
            {renderImages(review.imageURLs)}
          </View>
        )}
        <Text style={styles.text}>{review.review}</Text>
        <Text style={[CommonStyles.directionRow, { justifyContent: 'center', alignItems: 'center' }]}>
          <View>

          </View>
          {otherUserName && <Text style={{color: 'grey', marginLeft: 10, marginBottom: 3}}>{otherUserName}</Text>}
        </Text>
      </Card>}
    </>
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
    fontSize: 12,
    marginRight: 10,
  },

  boldText: {
    fontWeight: 'bold',
    fontSize: 15,
    color: "#000",
  },

  deleteButton: {
    padding: 8,
  },
  reviewImage: {
    width: 100,
    height: 100,
    borderRadius: 5,
    margin: 5,
  },

  imagesContainer: {
    flexDirection: 'row',
    marginTop: 10,
  },

});
