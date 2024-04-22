import { Platform, StyleSheet, Text, View } from "react-native";
import React, { useEffect, useState } from "react";
import Discover from "./screens/Discover";
import Start from "./screens/Start";
import Find from "./screens/Find";
import WishList from "./screens/WishList";
import { NavigationContainer } from "@react-navigation/native";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import Signup from "./components/Signup";
import Login from "./components/Login";
import { onAuthStateChanged, signOut } from "firebase/auth";
import { auth } from "./firebase-files/firebaseSetup";
import PressableButton from "./components/PressableButton";
import { Ionicons, AntDesign } from "@expo/vector-icons";
import Profile from "./screens/Profile";
import ForgetPassword from "./components/ForgetPassword";
import RestaurantDetail from "./screens/RestaurantDetail";
import AddReview from "./screens/AddReview";
import EditReview from "./screens/EditReview";
import MyReviews from "./screens/MyReviews";
import { createDrawerNavigator } from "@react-navigation/drawer";
import Notification from "./screens/Notification";
import 'react-native-gesture-handler';
import SearchResults from "./screens/SearchResults";
import Map from "./components/Map";
import LocationManager from "./components/LocationManager";
import * as Notifications from "expo-notifications";
import { getUserField,  updateUserField, readNotificationDateFromFirebase } from "./firebase-files/databaseHelper";
import { get, update } from "firebase/database";

Notifications.setNotificationHandler({
  handleNotification: async function (notification) {
    return {
      shouldShowAlert: true,
    };
  },
});

const Stack = createNativeStackNavigator();
const Tab = createBottomTabNavigator();
const Drawer = createDrawerNavigator();

export default function App() {

  const [userLoggedIn, setUserLoggedIn] = useState(false);
  const [loading, setLoading] = useState(true); // To manage loading state
  const userId = auth.currentUser?.uid;

  // add notificaiton listener
  useEffect(() => {
    const sunscription = Notifications.addNotificationReceivedListener(
      (notification) => {
        console.log("received listener", notification);
      }
    );
    return () => {
      sunscription.remove();
    };
  }, []);

  const verifyPermission = async () => {
    const status = await Notifications.getPermissionsAsync();
    if (status.status !== "granted") {
      const result = await Notifications.requestPermissionsAsync();
      if (result.status !== "granted") {
        Alert.alert("Permission required", "You need to grant notification permissions to use the app");
        return false;
      }
    }
    return true;
  }

  useEffect(() => {
    async function getPushToken () {
      try {
        const havePermission = await verifyPermission();
        if (!havePermission) {
          Alert.alert("Permission required", "You need to grant notification permissions to use the app")
          return;
        }
        if (Platform.OS === "android") {
          await Notifications.setNotificationChannelAsync("default", {
            name: "default",
            importance: Notifications.AndroidImportance.MAX,
          });
        } 
        const pushToken = await Notifications.getExpoPushTokenAsync({
          projectId: "deda0622-00e7-4dbc-bf9b-ecb94ccab9dd",
        });
        
        if (userLoggedIn) {
          await updateUserField(userId, "pushToken", pushToken.data);
          console.log(pushToken.data);
        }

      } catch (err) {
        console.log(err);
      }
    }
    getPushToken();
  }, []);

  useEffect(() => {
    // Function to send push notification every Friday at 5 pm
    const sendWeeklyNotification = async () => {
      try {
        const havePermission = await verifyPermission();
        if (!havePermission) {
          console.log("Permission not granted for sending push notifications.");
          return;
        }

        const now = new Date();
        const currentHour = now.getHours();
        const currentMinute = now.getMinutes();
        const currentSecond = now.getSeconds();
        console.log("Current time:", currentHour + ":" + currentMinute + ":" + currentSecond);
        
        const millisecondsInHour = 60 * 60 * 1000;
        const millisecondsInMinute = 60 * 1000;
        const millisecondsInSecond = 1000;
        
        let millisecondsUntilNotification;
        
        // If current time is before 12 pm
        if (currentHour < 12) {
            // Calculate milliseconds until 12 pm
            const millisecondsUntil12pm = (12 - currentHour) * millisecondsInHour -
                                          (currentMinute * millisecondsInMinute) -
                                          (currentSecond * millisecondsInSecond);
            
            millisecondsUntilNotification = millisecondsUntil12pm;
        } else { // If current time is after 12 pm
            // Calculate milliseconds until 12 pm tomorrow
            const millisecondsUntilNext12pm = (24 - currentHour + 12) * millisecondsInHour -
                                               (currentMinute * millisecondsInMinute) -
                                               (currentSecond * millisecondsInSecond);
        
            millisecondsUntilNotification = millisecondsUntilNext12pm;
        }
        
        console.log("Milliseconds until notification:", millisecondsUntilNotification);
        
        // Clear previous notification timeout
        const notificationTimeoutID = await getUserField(userId, "notificationTimeoutID");
        if (notificationTimeoutID) {
          clearTimeout(notificationTimeoutID);
          console.log("Cleared previous notification timeout.");
        }

        // Schedule the notification
        const newID = setTimeout(sendPushNotif, millisecondsUntilNotification);
        updateUserField(userId, "notificationTimeoutID", newID);

      } catch (error) {
        console.error("Error sending weekly push notification:", error);
      }
    };

    // Send the weekly notification when user is logged in
    if (userLoggedIn) {
      sendWeeklyNotification();
    }
  }, [userLoggedIn]);

  async function sendPushNotif() {
    const pushToken = await getUserField(userId, "pushToken");
    console.log("Sending push notification to:", pushToken);
    fetch("https://exp.host/--/api/v2/push/send", {
      method: "POST",
      headers: {
        "content-type": "application/json",
      },
      body: JSON.stringify({
        to: pushToken,
        title: "Daily Reminder",
        body: "Don't forget to try a new restaurant this weekend!",
      }),
    });
  }

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      if (user) {
        setUserLoggedIn(true);
      } else {
        setUserLoggedIn(false);
      }
      setLoading(false); // Set loading to false once auth state is determined
    });

    // Cleanup function
    return unsubscribe;
  }, []);

  useEffect(() => {
    const fetchNotificationDate = async () => {
      try {
        // Fetch notification date from Firebase only if user is logged in
        if (userLoggedIn) {
            const fetchedDate = await readNotificationDateFromFirebase(auth.currentUser?.uid);

          if (!Array.isArray(fetchedDate)) {
              console.error("Invalid notification dates format.");
              return;
          }

          fetchedDate.forEach(async (doc) => {
            const date = doc.timestamp;

            if (!date || typeof date !== 'object' || !(date instanceof Date)) {
                return;
            }
            
            if (date.getTime() <= Date.now()) {
                //console.log("Notification date is in the past.");
                return;
            }

            const triggerTime = date.getTime() - Date.now();
            if (triggerTime <= 0) {
                console.log("Trigger time is in the past.");
                return;
            }

            const schedulingOptions = {
                content: {
                    title: "Time to try!",
                    body: `Don't forget to try ${doc.restaurantName}!`,
                },
                trigger: {
                    seconds: Math.floor(triggerTime / 1000), // Convert milliseconds to seconds
                },
            };

            try {
                await Notifications.scheduleNotificationAsync(schedulingOptions);
            } catch (error) {
                console.error("Error scheduling notification:", error);
            }
          });
        }
      } catch (error) {
          console.error("Error fetching notification date:", error);
      }
    };

    fetchNotificationDate();
}, [userLoggedIn]);

  const AuthStack = () => (
    <Stack.Navigator screenOptions={{ headerStyle: { backgroundColor: "tomato" }, headerTintColor: "white" }}>
      <Stack.Screen name="Start" component={Start} options={{ headerShown: false }} />
      <Stack.Screen name="Signup" component={Signup} options={{ title: "Sign Up" }} />
      <Stack.Screen name="Login" component={Login} options={{ title: "Login" }} />
      <Stack.Screen name="Forget Password" component={ForgetPassword} />
    </Stack.Navigator>
  );

  const AppTabsScreen = () => {
    return (
      <Tab.Navigator
        screenOptions={{
          headerStyle: { backgroundColor: "tomato" },
          headerTintColor: "white",
          tabBarActiveTintColor: "tomato",
          tabBarInactiveTintColor: "gray"
        }}>
        <Tab.Screen
          name="Discover"
          component={Discover}
          options={{
            tabBarIcon: ({ color, size }) => (
              <Ionicons name="home" size={size} color={color} />
            ),
          }}
        />
        <Tab.Screen
          name="Find"
          component={Find}
          options={{
            tabBarIcon: ({ color, size }) => (
              <Ionicons name="search" size={size} color={color} />
            ),
          }}
        />
        <Tab.Screen
          name="WishList"
          component={WishList}
          options={{
            tabBarIcon: ({ color, size }) => (
              <Ionicons name="heart" size={size} color={color} />
            ),
          }}
        />
        <Tab.Screen
          name="Profile"
          component={Profile}
          options={{
            tabBarIcon: ({ color, size }) => (
              <Ionicons name="person" size={size} color={color} />
            ),
          }}
        />
      </Tab.Navigator>
    );
  };

  // Function to return the App Tabs Screen with Drawer Navigation
  const DrawerWithTabs = () => {
    return (
      <Drawer.Navigator initialRouteName="Home"
        screenOptions={{
          headerShown: false,
          drawerStyle: {
            backgroundColor: "white",
            width: 240,
          },
          drawerActiveTintColor: "tomato",
          drawerInactiveTintColor: "gray",
        }} >
        <Drawer.Screen name="Home" component={AppTabsScreen} />
        <Drawer.Screen name="My Schedules" component={Notification} />
      </Drawer.Navigator>
    );
  };

  if (loading) {
    return (
      <View style={styles.container}>
        <Text>Loading...</Text>
      </View>
    );
  }

  return (
    <NavigationContainer>
      {userLoggedIn ? (
        <Stack.Navigator>
          <Stack.Screen
            name="DrawerHome"
            component={DrawerWithTabs}
            options={{ headerShown: false, title: "Back" }} />
          <Stack.Screen
            name="Restaurant"
            component={RestaurantDetail}
            options={({ route }) => ({ title: route.params.item.name })} />
          <Stack.Screen name="Search Results" component={SearchResults} />
          <Stack.Screen name="Add My Review" component={AddReview} />
          <Stack.Screen name="Edit My Review" component={EditReview} />
          <Stack.Screen name="My Reviews" component={MyReviews} />
          <Stack.Screen name="Map" component={Map} />
          <Stack.Screen name="LocationManager" component={LocationManager} />
        </Stack.Navigator>
      ) : (
        AuthStack()
      )}
    </NavigationContainer>
  );
}

const styles = StyleSheet.create({});
