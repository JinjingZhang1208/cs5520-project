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
import { readNotificationDateFromFirebase } from '../firebase-files/databaseHelper';
import { auth, database } from '../firebase-files/firebaseSetup';
import { collection, getDocs } from 'firebase/firestore';

const formatDate = (date) => {
  const options = {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit'
  };
  return date.toLocaleDateString(undefined, options);
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
        const snapshot = await getDocs(collectionRef);
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
      } catch (error) {
        console.error('Error fetching notifications:', error);
      }
    };

    fetchNotifications();
  }, []);


  return (
    <View style={styles.container}>
      <Text style={styles.title}>Notifications Scheduled</Text>
      {notifications.length > 0 ? (
        <View style={styles.tableContainer}>
          <View style={styles.tableHeader}>
            <Text style={styles.headerText}>Date</Text>
            <Text style={styles.headerText}>Restaurant Name</Text>
          </View>
          <FlatList
            data={notifications}
            renderItem={({ item }) => (
              <View style={styles.tableRow}>
                <Text style={styles.cellText}>{formatDate(item.date)}</Text>
                <Text style={styles.cellText}>{item.restaurantName}</Text>
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
