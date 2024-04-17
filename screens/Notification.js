import React, { useEffect, useState } from 'react';
import { StyleSheet, Text, View, TouchableOpacity, FlatList } from 'react-native';
import CommonStyles from '../styles/CommonStyles';
import { useNavigation } from '@react-navigation/native';
import { readNotificationDateFromFirebase } from '../firebase-files/databaseHelper';
import { auth, database } from '../firebase-files/firebaseSetup'; // Assuming you export database from firebaseSetup
import { collection, getDocs } from 'firebase/firestore';

const formatDate = (date) => {
  const options = { year: 'numeric', month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit' };
  return date.toLocaleDateString(undefined, options);
};

const Notification = () => {
  const navigation = useNavigation();
  const [notificationDates, setNotificationDates] = useState([]);

  useEffect(() => {
    const fetchNotificationDates = async () => {
      try {
        const user = auth.currentUser;
        if (!user) {
          console.error('User not authenticated');
          return;
        }

        const collectionRef = collection(database, "users", user.uid, "notificationData");
        const snapshot = await getDocs(collectionRef);
        const dates = snapshot.docs.map(doc => {
          const timestamp = doc.data().timestamp;
          return timestamp ? timestamp.toDate() : null;
        });
        setNotificationDates(dates.filter(date => date !== null));
      } catch (error) {
        console.error('Error fetching notification dates:', error);
      }
    };

    fetchNotificationDates();
  }, []);


  return (
    <View style={styles.container}>
      <Text style={styles.title}>Notification Dates:</Text>
      {notificationDates.length > 0 ? (
        <FlatList
          data={notificationDates}
          renderItem={({ item }) => (
            <Text style={styles.notificationItem}>- {formatDate(item)}</Text>
          )}
          keyExtractor={(item, index) => index.toString()}
        />
      ) : (
        <Text style={styles.notificationText}>No notifications found!</Text>
      )}
      <TouchableOpacity style={styles.button} onPress={() => navigation.goBack()}>
        <Text style={styles.buttonText}>Go back</Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 80,
  },
  title: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 10,
  },
  notificationItem: {
    fontSize: 16,
    marginBottom: 5,
  },
  notificationText: {
    fontSize: 18,
    marginBottom: 20,
  },
  button: {
    backgroundColor: 'tomato',
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

export default Notification;
