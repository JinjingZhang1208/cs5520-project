import { StyleSheet, Text, View } from "react-native";
import React, { useEffect, useState } from "react";
import Discover from "./screens/Discover";
import Start from "./screens/Start";
import { NavigationContainer } from "@react-navigation/native";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import Signup from "./components/Signup";
import Login from "./components/Login";
import { onAuthStateChanged, signOut } from "firebase/auth";
import { auth } from "./firebase-files/firebaseSetup";
import PressableButton from "./components/PressableButton";
import { Ionicons, AntDesign } from "@expo/vector-icons";
import Profile from "./components/Profile";
import ForgetPassword from "./components/ForgetPassword";

const Stack = createNativeStackNavigator();
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
    return () => unsubscribe();
  }, []);

  const AuthStack = () => {
    return (
      <>
        <Stack.Screen
          name="Start"
          component={Start}
          options={{ headerShown: false }}
        />
        <Stack.Screen
          name="Signup"
          component={Signup}
          options={{ title: "Sign Up" }}
        />
        <Stack.Screen
          name="Login"
          component={Login}
          options={{ title: "Log In" }}
        />
        <Stack.Screen name="Forget Password" component={ForgetPassword} />
      </>
    );
  };

  const AppStack = () => {
    return (
      <>
        <Stack.Screen
          options={({ navigation }) => ({
            headerTitle: "Discover",
            headerRight: () => (
              <PressableButton
                onPress={() => navigation.navigate("Profile")}
                customStyle={styles.buttonStyle}
              >
                <Ionicons name="person" size={24} color="white" />
              </PressableButton>
            ),
          })}
          name="Discover"
          component={Discover}
        />
        <Stack.Screen
          name="Profile"
          component={Profile}
          options={({ navigation }) => ({
            headerRight: () => (
              <PressableButton
                onPress={() => {
                  signOut(auth)
                    .then(() => navigation.replace("Login"))
                    .catch((error) => console.error("Error signing out:", error));
                }}
                customStyle={styles.buttonStyle}
              >
                <AntDesign name="logout" size={24} color="white" />
              </PressableButton>
            ),
          })}
        />
      </>
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
      <Stack.Navigator
        screenOptions={{
          headerStyle: { backgroundColor: "#929" },
          headerTintColor: "white",
        }}
      >
        {userLoggedIn ? (
          AppStack()
        ) : (
          AuthStack()
        )}
        
      </Stack.Navigator>
    </NavigationContainer>
  );
}

const styles = StyleSheet.create({});