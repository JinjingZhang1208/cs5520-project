import { StyleSheet, Text, View } from "react-native";
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
import { readNotificationDateFromFirebase } from "./firebase-files/databaseHelper";

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
  const [notificationDate, setNotificationDate] = useState(null);

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
          const date = await readNotificationDateFromFirebase(auth.currentUser.uid);
          console.log("Notification date:", date);

          if (!date || date.getTime() <= Date.now()) {
            console.log("Invalid notification date or date is in the past.");
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
              body: "Don't forget to try the restaurant!",
            },
            trigger: {
              seconds: Math.floor(triggerTime / 1000), // Convert milliseconds to seconds
            },
          };

          await Notifications.scheduleNotificationAsync(schedulingOptions);
        }
      } catch (error) {
        console.error("Error fetching notification date:", error);
      }
    };

    fetchNotificationDate();
  }, [userLoggedIn]);

  const AuthStack = () => (
    <Stack.Navigator screenOptions={{ headerStyle: { backgroundColor: "#C08B5C" }, headerTintColor: "white" }}>
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
        <Drawer.Screen name="Notifications" component={Notification} />
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
          {/* <Stack.Screen name="Home" component={AppTabsScreen} options={{ headerShown: false }} /> */}
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