import React, { useEffect, useState } from 'react';
import {
  StyleSheet,
  Text,
  View,
  TouchableOpacity,
  FlatList
} from 'react-native';
import CommonStyles from '../styles/CommonStyles';
import { useNavigation } from '@react-navigation/native';
import { readNotificationDateFromFirebase, deleteNotificationFromFirebase } from '../firebase-files/databaseHelper';
import { auth, database } from '../firebase-files/firebaseSetup';
import { collection, getDocs, onSnapshot } from 'firebase/firestore';
import { AntDesign } from '@expo/vector-icons';


const formatDate = (date) => {
  const optionsDate = {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
  };

  const optionsTime = {
    hour: '2-digit',
    minute: '2-digit'
  };

  const formattedDate = date.toLocaleDateString(undefined, optionsDate);
  const formattedTime = date.toLocaleTimeString(undefined, optionsTime);

  return { date: formattedDate, time: formattedTime };
};

const Notification = () => {
  const navigation = useNavigation();
  const [notifications, setNotifications] = useState([]);

  useEffect(() => {
    const fetchNotifications = async () => {
      try {
        const user = auth.currentUser;
        if (!user) {
          console.error('User not authenticated');
          return;
        }

        const collectionRef = collection(database, "users", user.uid, "notificationData");
        const unsubscribe = onSnapshot(collectionRef, (snapshot) => {
          const fetchedNotifications = snapshot.docs.map(doc => {
            const data = doc.data();
            const timestamp = data.timestamp;
            return timestamp ? {
              id: doc.id,
              date: timestamp.toDate(),
              restaurantName: data.restaurantName || ""
            } : null;
          });
          setNotifications(fetchedNotifications.filter(notification => notification !== null));
        });

        return () => unsubscribe();
      } catch (error) {
        console.error('Error fetching notifications:', error);
      }
    };

    fetchNotifications();
  }, []);


  const deleteNotificationHandler = async (id) => {
    try {
      await deleteNotificationFromFirebase(auth.currentUser.uid, id);
      setNotifications(notifications.filter(notification => notification.id !== id));
    } catch (error) {
      console.error('Error deleting notification:', error);
    }
  }

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Notifications Scheduled</Text>
      {notifications.length > 0 ? (
        <View style={styles.tableContainer}>
          <View style={styles.tableHeader}>
            <Text style={styles.headerText}>Date</Text>
            <Text style={styles.headerText1}>Restaurant Name</Text>
            <Text style={styles.headerText}>Remove</Text>
          </View>
          <FlatList
            data={notifications}
            renderItem={({ item }) => (
              <View style={styles.tableRow}>
                <View>
                  <Text style={styles.cellText}>{formatDate(item.date).date}</Text>
                  <Text style={styles.cellText}>{formatDate(item.date).time}</Text>
                </View>
                <Text style={styles.cellText}>{item.restaurantName}</Text>
                <TouchableOpacity onPress={() => deleteNotificationHandler(item.id)}>
                  <AntDesign name="delete" size={24} color="red" />
                </TouchableOpacity>
              </View>
            )}
            keyExtractor={(item, index) => item.id}
            contentContainerStyle={styles.flatlistContent}
          />

        </View>
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
    paddingHorizontal: 20,
    paddingTop: 40,
  },
  title: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 20,
    marginTop: 30,
    textAlign: 'center',
  },
  tableContainer: {
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 8,
    overflow: 'hidden',
  },
  tableHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    backgroundColor: 'tomato',
    paddingVertical: 10,
    paddingHorizontal: 15,
    alignItems: 'center',
  },
  headerText: {
    color: 'white',
    fontWeight: 'bold',
    fontSize: 16,
  },
  headerText1: {
    color: 'white',
    fontWeight: 'bold',
    fontSize: 16,
    marginLeft: 80,
  },
  tableRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    borderBottomWidth: 1,
    borderBottomColor: '#ccc',
    paddingVertical: 10,
    paddingHorizontal: 15,
  },
  cellText: {
    fontSize: 16,
  },
  notificationText: {
    fontSize: 18,
    marginBottom: 20,
    textAlign: 'center',
  },
  button: {
    backgroundColor: 'tomato',
    paddingHorizontal: 20,
    paddingVertical: 10,
    borderRadius: 8,
    marginTop: 20,
    marginBottom: 40,
    alignSelf: 'center',
  },
  buttonText: {
    color: 'white',
    fontSize: 16,
  },
});

export default Notification;
