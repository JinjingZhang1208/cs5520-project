import React from 'react';
import { StyleSheet, Text, View, Image } from 'react-native';
import PressableButton from '../components/PressableButton';
import Delicious from '../assets/delicious.png';

const Start = ({ navigation }) => {
  return (
    <View style={styles.container}>
      <Image source={Delicious} style={styles.image} />
      <Text style={styles.title}>Chinese Restaurants Finder</Text>
      <View style={styles.buttonsContainer}>
        <PressableButton onPress={() => navigation.navigate('Login')} customStyle={styles.button}>
          <Text style={styles.buttonText}>Login</Text>
        </PressableButton>
        <PressableButton onPress={() => navigation.navigate('Signup')} customStyle={styles.button}>
          <Text style={styles.buttonText}>Sign Up</Text>
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
    color: 'tomato',
  },
  buttonsContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  button: {
    paddingHorizontal: 20,
    paddingVertical: 10,
    borderRadius: 8,
    backgroundColor: 'tomato',
    marginLeft: 40,
    marginRight: 35,
  },
  image: {
    width: 200,
    height: 200,
    marginBottom: 20,
  },
  buttonText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: 'bold',
  },
});

export default Start;