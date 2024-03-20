import { StyleSheet, Text, View } from 'react-native'
import React from 'react'
import PressableButton from '../components/PressableButton';

const Start = ({ navigation }) => {
  return (
    <View style={styles.container}>
      <Text>Chinese Restaurants Finder</Text>
      <PressableButton onPress={() => navigation.navigate("Login")}>Log In</PressableButton>
      <PressableButton onPress={() => navigation.navigate("Signup")}>Sign Up</PressableButton>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
});

export default Start;
