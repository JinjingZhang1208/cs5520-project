import { Alert, Pressable, StyleSheet, Text, View, Image } from 'react-native';
import React, { useState, useEffect } from 'react';
import { useNavigation } from '@react-navigation/native';
import PressableButton from './PressableButton';
import { MaterialIcons } from '@expo/vector-icons';
import { auth, database } from '../firebase-files/firebaseSetup';
import { deleteFromDB } from '../firebase-files/databaseHelper';
import { fetchUserData } from '../firebase-files/databaseHelper';
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
        <View style={[{ marginLeft: 10, marginRight: 10, padding: 5}]}>
          <View style={[{flexDirection: 'row', justifyContent: 'space-between'}, styles.reviewContainer]}>
            <Pressable
              style={({ pressed }) => [pressed && styles.pressed]}
              onPress={reviewPressHandler} andriod_ripple={{ color: '#e9e' }}>
                  <Text style={styles.boldText}>{review.restaurantName}</Text>
                  {review.imageURLs && review.imageURLs.length > 0 && (
                    <View style={styles.imagesContainer}>
                      {renderImages(review.imageURLs)}
                    </View>
                  )}
                  <Text style={styles.text}>{review.review}</Text>
            </Pressable>
            
            <View style={{flexDirection: 'row', justifyContent: 'flex-end', alignItems: 'center', marginRight: '2%'}}>
                <PressableButton onPress={deleteHandler} style={styles.d}>
                  <MaterialIcons name="delete" size={24} color="black" />
                </PressableButton>
            </View>
          </View>
        </View>
      )}

      {/* {console.log('review owner:', review)} */}

      {review.owner != userId && (
        <View style={{ marginLeft: 10, marginRight: 10, padding: 5 }}>
          <View style={styles.reviewContainer}>

            <Text style={styles.boldText}>{review.restaurantName}</Text>

            {review.imageURLs && review.imageURLs.length > 0 && (
              <View style={styles.imagesContainer}>
                {renderImages(review.imageURLs)}
              </View>
            )}

            <Text style={styles.text}>{review.review}</Text>

            <View style={[CommonStyles.directionRow]}>
              <View>
                <Image
                  source={{
                    uri: avatarUrl !== '' ? avatarUrl : "https://upload.wikimedia.org/wikipedia/commons/7/7c/Profile_avatar_placeholder_large.png"
                  }}
                  style={{ width: 15, height: 15, borderRadius: 25 }}
                />
              </View>
              {otherUserName && <Text style={{ color: 'grey', marginLeft: 5, marginBottom: 3 }}>{otherUserName}</Text>}
            </View>
          </View>
        </View>
      )}
    </>
  )
}

const styles = StyleSheet.create({
  pressed: {
    opacity: 0.5,
  },

  reviewContainer: {
    position: 'relative',
    borderRadius: 10,
    backgroundColor: "#FFF",
    marginBottom: 5,
    padding: 10,
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
    fontSize: 15,
    marginRight: 10,
  },

  boldText: {
    fontWeight: 'bold',
    fontSize: 15,
    color: "#000",
  },

  deleteButton: {
    top: 10,
    right: 10,
    padding: 8,
    position: 'absolute',
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
