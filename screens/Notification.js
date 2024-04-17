import React, { useEffect, useState } from 'react';
import { StyleSheet, Text, View, TouchableOpacity } from 'react-native';
import CommonStyles from '../styles/CommonStyles';
import { useNavigation } from '@react-navigation/native';
import { readNotificationDateFromFirebase } from '../firebase-files/databaseHelper';
import { auth } from '../firebase-files/firebaseSetup';

const formatDate = (date) => {
  const options = { year: 'numeric', month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit' };
  return date.toLocaleDateString(undefined, options);
};

const Notification = () => {
  const navigation = useNavigation();
  const [notificationDate, setNotificationDate] = useState(null);

  useEffect(() => {
    const fetchNotificationDate = async () => {
      try {
        const date = await readNotificationDateFromFirebase(auth.currentUser.uid);
        setNotificationDate(date);
      } catch (error) {
        console.error('Error fetching notification date:', error);
      }
    };

    fetchNotificationDate();
  }, []);

  return (
    <View style={styles.container}>
      {notificationDate ? (
        <Text style={styles.notificationText}>Notification date: {formatDate(notificationDate)}</Text>
      ) : (
        <Text style={styles.notificationText}>We will push your notifications here!</Text>
      )}
      <TouchableOpacity style={styles.button} onPress={() => navigation.goBack()}>
        <Text style={styles.buttonText}>Go back</Text>
      </TouchableOpacity>
    </View>
  );
};

export default Notification;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 80,
  },
  notificationText: {
    fontSize: 18,
    marginBottom: 20,
  },
  button: {
    backgroundColor: '#453F78',
    paddingHorizontal: 20,
    paddingVertical: 10,
    borderRadius: 8,
    marginTop: 20,
  },
  buttonText: {
    color: 'white',
    fontSize: 16,
  },
});
