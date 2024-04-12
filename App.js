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
import { SafeAreaView } from "react-native";

const Stack = createNativeStackNavigator();
const Tab = createBottomTabNavigator();
const Drawer = createDrawerNavigator();


export default function App() {
  const [userLoggedIn, setUserLoggedIn] = useState(false);
  const [loading, setLoading] = useState(true); // To manage loading state

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
        <Drawer.Screen name="Map" component={Map} />
        <Drawer.Screen name="AddReview" component={AddReview} />
        <Drawer.Screen name="Notifications" component={Notification} />
        <Drawer.Screen name="LocationManager" component={LocationManager} />
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
    <SafeAreaView style={{ flex: 1 }}>
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
          </Stack.Navigator>
        ) : (
          AuthStack()
        )}
      </NavigationContainer>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({});