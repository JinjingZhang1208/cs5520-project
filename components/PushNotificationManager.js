import { useEffect } from 'react';
import { Platform, Alert } from 'react-native';
import * as Notifications from 'expo-notifications';

export async function registerForPushNotificationsAsync() {
    try {
        const { status } = await Notifications.requestPermissionsAsync();
        if (status !== 'granted') {
            console.log('Permission to receive notifications was denied');
            return null;
        }
        const token = (await Notifications.getExpoPushTokenAsync()).data;
        console.log('Expo push token:', token);
        return token;
    } catch (error) {
        console.error('Error registering for push notifications:', error);
        return null;
    }
}

function sendPushNotif() {
    fetch("https://exp.host/--/api/v2/push/send", {
      method: "POST",
      headers: {
        "content-type": "application/json",
      },
      body: JSON.stringify({
        // in a real life scenario, the push token will be read from users collection in firestore
        to: "ExponentPushToken[UCeulRJ5WFlI16HdZCyaVo]",
        title: "Push Notification",
        body: "This is a push notification",
      }),
    });
}

export default function PushNotificationManager() {
    useEffect(() => {
      const register = async () => {
        const token = await registerForPushNotificationsAsync();
        if (!token) {
          Alert.alert("You need to give permission to receive notifications");
        } else {
          console.log('Push notification token:', token);
          // Schedule the notification to be sent every day at 11:30 AM
          const schedulingOptions = {
            content: {
              title: "Lunch time!",
              body: "Search for a new restaurant to try out.",
            },
            trigger: {
              hour: 11,
              minute: 30,
              repeats: true,
            },
          };
  
          try {
            await Notifications.scheduleNotificationAsync(schedulingOptions);
          } catch (error) {
            console.error("Error scheduling notification:", error);
          }
        }
      };
      register();
    }, []);
  
    return null; 
  }