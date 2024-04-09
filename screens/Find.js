import { StyleSheet, Text, TextInput, View } from 'react-native';
import React, { useState } from 'react';
import PressableButton from '../components/PressableButton';
import { Picker } from '@react-native-picker/picker'; // Import Picker

const Find = () => {
  const [searchKeyword, setSearchKeyword] = useState('');
  const [searchDistance, setSearchDistance] = useState("5");
  const [searchRating, setSearchRating] = useState("4");

  return (
    <View style={styles.container}>
      <TextInput
        style={styles.TextInput}
        placeholder='Search for restaurants'
        onChangeText={setSearchKeyword}
        value={searchKeyword}
      />

      {/* Distance Picker */}
      <Picker
        selectedValue={searchDistance}
        onValueChange={(itemValue, itemIndex) => setSearchDistance(itemValue)}
        style={styles.pickerStyle}>
        <Picker.Item label="1 km" value="1" />
        <Picker.Item label="5 km" value="5" />
        <Picker.Item label="10 km" value="10" />
        <Picker.Item label="20 km" value="20" />
      </Picker>

      {/* Rating Picker */}
      <Picker
        selectedValue={searchRating}
        onValueChange={(itemValue, itemIndex) => setSearchRating(itemValue)}
        style={styles.pickerStyle}>
        <Picker.Item label="Any Rating" value="0" />
        <Picker.Item label="4 Stars & Up" value="4" />
        <Picker.Item label="3 Stars & Up" value="3" />
        <Picker.Item label="2 Stars & Up" value="2" />
        <Picker.Item label="1 Star & Up" value="1" />
      </Picker>
    </View>
  )
}

export default Find;

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  TextInput: {
    marginTop: 50,
    marginLeft: 30,
    marginRight: 30,
    marginBottom: 30,
    height: 40,
    padding: 10,
    borderRadius: 3,
    borderWidth: 2,
  },
  pickerStyle: {
    height: 50,
    width: '80%',
    alignSelf: 'center',
  }
})
