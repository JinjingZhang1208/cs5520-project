import React, { useState, useEffect } from "react";
import { View, Alert, TouchableOpacity, Text, StyleSheet } from "react-native";
import { FontAwesome } from '@expo/vector-icons';
import DateTimePickerModal from "react-native-modal-datetime-picker";
import * as Notifications from "expo-notifications";
import { writeNotificationDateToFirebase } from "../firebase-files/databaseHelper";

export async function verifyPermission() {
    try {
        const status = await Notifications.getPermissionsAsync();
        if (status.granted) {
            return true;
        }

        const permissionResponse = await Notifications.requestPermissionsAsync();
        return permissionResponse.granted;
    } catch (error) {
        console.error("Error verifying permission:", error);
        return false;
    }
}
export default function NotificationManager({ userId, restaurantId, restaurantName }) {
    const [isDatePickerVisible, setDatePickerVisibility] = useState(false);
    const [minimumDate, setMinimumDate] = useState(new Date());

    useEffect(() => {
        // Set the minimum date and time once when the component mounts
        setMinimumDate(new Date());
    }, []);

    const showDatePicker = () => {
        setDatePickerVisibility(true);
    };

    const hideDatePicker = () => {
        setDatePickerVisibility(false);
    };

    async function localNotificationHandler() {
        try {
            const havePermission = await verifyPermission();
            if (!havePermission) {
                Alert.alert("You need to give permission for notifications");
                return;
            }
        } catch (error) {
            console.error("Error handling local notification:", error);
        }
    }

    const handleConfirm = async (date) => {
        console.log("Selected date:", date);
        hideDatePicker();
        localNotificationHandler();
        if (userId) {
            await writeNotificationDateToFirebase(userId, date, restaurantId, restaurantName);
        } else {
            Alert.alert("User not authenticated");
        }
    };

    return (
        <View style={styles.container}>
            <TouchableOpacity onPress={showDatePicker}>
                <FontAwesome name="calendar-plus-o" size={19} color="black" />
            </TouchableOpacity>

            <DateTimePickerModal
                isVisible={isDatePickerVisible}
                mode="datetime"
                minimumDate={new Date()}
                onConfirm={handleConfirm}
                onCancel={hideDatePicker}
                textColor="black"
            />
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        marginTop: 6,
        marginLeft: 5,
    },
});
