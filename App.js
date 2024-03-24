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

const Stack = createNativeStackNavigator();
const BottomTab = createBottomTabNavigator();

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
    <Stack.Navigator screenOptions={{ headerStyle: { backgroundColor: "#929" }, headerTintColor: "white" }}>
      <Stack.Screen name="Start" component={Start} options={{ headerShown: false }} />
      <Stack.Screen name="Signup" component={Signup} options={{ title: "Sign Up" }} />
      <Stack.Screen name="Login" component={Login} options={{ title: "Log In" }} />
      <Stack.Screen name="Forget Password" component={ForgetPassword} />
    </Stack.Navigator>
  );

  const AppTabsScreen = () => {
    return (
      <BottomTab.Navigator screenOptions={{ headerShown: false, tabBarActiveTintColor: "tomato", tabBarInactiveTintColor: "gray" }}>
        <BottomTab.Screen 
          name="Discover" 
          component={Discover} 
          options={{
            tabBarIcon: ({ color, size }) => (
              <Ionicons name="home" size={size} color={color} />
            ),
          }}
        />
        <BottomTab.Screen
          name="Find"
          component={Find}
          options={{
            tabBarIcon: ({ color, size }) => (
              <Ionicons name="search" size={size} color={color} />
            ),
          }}
        />
        <BottomTab.Screen
          name="WishList"
          component={WishList}
          options={{
            tabBarIcon: ({ color, size }) => (
              <Ionicons name="heart" size={size} color={color} />
            ),
          }}
        />
        <BottomTab.Screen 
          name="Profile"
          component={Profile}
          options={{
            tabBarIcon: ({ color, size }) => (
              <Ionicons name="person" size={size} color={color} />
            ),

          }}
        />
      </BottomTab.Navigator>
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
          AppTabsScreen()
        ) : (
          AuthStack()
        )}
        

    </NavigationContainer>
  );
}

const styles = StyleSheet.create({});