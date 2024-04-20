import { useEffect } from 'react';
import { Platform, Alert } from 'react-native';
import * as Notifications from 'expo-notifications';
import { format, setHours, setMinutes, setSeconds, isAfter } from 'date-fns';
import { verifyPermission } from './NotificationManager';

export async function registerForPushNotifications() {
    try {
        const havePermission = await verifyPermission();
        if (!havePermission) {
            Alert.alert("You need to give permission to receive notifications");
            return;
        }
        if (Platform.OS === 'android') {
            await Notifications.setNotificationChannelAsync('default', {
                name: 'default',
                importance: Notifications.AndroidImportance.MAX,
            });
        }
        const pushToken = await Notifications.getExpoPushTokenAsync();
        console.log(pushToken.data);

    } catch (error) {
        console.error('Error registering for push notifications:', error);
    }
}

export async function scheduleDailyNotification() {
    try {
        const now = new Date();
        const nextNotificationTime = setSeconds(setMinutes(setHours(now, 11), 30), 0); // Set time to 11:30 AM

        if (isAfter(nextNotificationTime, now)) {
            const schedulingOptions = {
                content: {
                    title: "Don't know what for lunch?",
                    body: "Lunchtime! Consider trying something new.",
                },
                trigger: {
                    date: nextNotificationTime,
                    repeats: true,
                },
            };

            await Notifications.scheduleNotificationAsync(schedulingOptions);
        }
    } catch (error) {
        console.error('Error scheduling daily notification:', error);
    }
}

