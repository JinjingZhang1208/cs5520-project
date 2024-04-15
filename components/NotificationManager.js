import { View, Alert } from "react-native";
import React from "react";
import * as Notifications from "expo-notifications";
import { FontAwesome } from '@expo/vector-icons';

export default function NotificationManager() {
    async function verifyPermission() {
        try {
            const status = await Notifications.getPermissionsAsync();
            if (status.granted) {
                return true;
            }

            // ask for permission
            const permissionResponse = await Notifications.requestPermissionsAsync();
            return permissionResponse.granted;
        } catch (err) {
            console.log(err);
        }
    }

    async function localNotificationHandler() {
        // use await/async and try/catch
        try {
            const havePermission = await verifyPermission();
            if (!havePermission) {
                Alert.alert("You need to give permission for notifications");
                return;
            }

            const id = await Notifications.scheduleNotificationAsync({
                content: {
                    title: "Add a goal",
                    body: "Don't forget to add your daily goal",
                    data: { url: "https://google.com" },
                },
                trigger: { seconds: 3 },
            });
        } catch (err) {
            console.log(err);
        }
    }

    return (
        <View style={{ marginTop: 6, marginLeft: 5 }}>
            <FontAwesome
                name="calendar-plus-o"
                size={19}
                color="black"
                onPress={localNotificationHandler}
            />
        </View >
    );
}