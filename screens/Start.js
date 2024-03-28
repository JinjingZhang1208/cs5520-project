import React from 'react';
import { StyleSheet, Text, View } from 'react-native';
import PressableButton from '../components/PressableButton';

const Start = ({ navigation }) => {
  return (
    <View style={styles.container}>
      <Text style={styles.title}>Chinese Restaurants Finder</Text>
      <View style={styles.buttonsContainer}>
        <PressableButton onPress={() => navigation.navigate('Login')} customStyle={styles.button}>
          Log In
        </PressableButton>
        <PressableButton onPress={() => navigation.navigate('Signup')} customStyle={styles.button}>
          Sign Up
        </PressableButton>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#fff',
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 20,
  },
  buttonsContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  button: {
    paddingHorizontal: 20,
    paddingVertical: 10,
    borderRadius: 8,
  },
});

export default Start;