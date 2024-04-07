import { StyleSheet, Text, TextInput, View } from 'react-native';
import React, { useState } from 'react';
import PressableButton from '../components/PressableButton';
import { Picker } from '@react-native-picker/picker'; // Import Picker

const Find = () => {
  const [searchKeyword, setSearchKeyword] = useState('');
  const [searchDistance, setSearchDistance] = useState("5");
  const [searchRating, setSearchRating] = useState("4");
  const [showDistancePicker, setShowDistancePicker] = useState(false);
  const [showRatingPicker, setShowRatingPicker] = useState(false);


  return (
    <View style={styles.container}>

      {/* Restaurant name input */}
      <TextInput
        style={styles.TextInput}
        placeholder='Search for restaurants'
        onChangeText={setSearchKeyword}
        value={searchKeyword}
      />

      {/* Rating Picker */}
      <View style={styles.horizontal}>
        <Text style={styles.text}>Sort by Rating </Text>
        <TextInput
          // style={styles.TextInput}
          placeholder='Rating'
          onChangeText={setSearchRating}
          value={searchRating}
          onFocus={() => setShowRatingPicker(true)}
          onBlur={() => setShowRatingPicker(false)}
        />
        {showRatingPicker && (
          <Picker
            selectedValue={searchRating}
            onValueChange={(itemValue, itemIndex) => {
              setSearchRating(itemValue);
              setShowRatingPicker(false);
            }}
            style={styles.pickerStyle}>
            <Picker.Item label="Any Rating" value="0" />
            <Picker.Item label="4 Stars & Up" value="4" />
            <Picker.Item label="3 Stars & Up" value="3" />
            <Picker.Item label="2 Stars & Up" value="2" />
            <Picker.Item label="1 Star & Up" value="1" />
          </Picker>
        )}
      </View>

      {/* Distance Picker */}
      <View style={styles.horizontal}>
        <Text style={styles.text}>Sort by Distance </Text>
        <TextInput
          // style={styles.TextInput}
          placeholder='Distance in km'
          onChangeText={setSearchDistance}
          value={searchDistance}
          onFocus={() => setShowDistancePicker(true)}
          onBlur={() => setShowDistancePicker(false)}
        />
        {showDistancePicker && (
          <Picker
            selectedValue={searchDistance}
            onValueChange={(itemValue, itemIndex) => {
              setSearchDistance(itemValue);
              setShowDistancePicker(false);
            }}
            style={styles.pickerStyle}>
            <Picker.Item label="1 km" value="1" />
            <Picker.Item label="3 km" value="3" />
            <Picker.Item label="5 km" value="5" />
            <Picker.Item label="10 km" value="10" />
            <Picker.Item label="15 km" value="15" />
          </Picker>
        )}
      </View>

    </View>
  )
}

export default Find;

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  horizontal: {
    flexDirection: 'row',
    marginLeft: 30,
    // justifyContent: 'center',
    // alignItems: 'center',
    padding: 10,
  },
  TextInput: {
    marginTop: 50,
    marginLeft: 30,
    marginRight: 30,
    marginBottom: 10,
    height: 60,
    padding: 15,
    borderRadius: 3,
    borderWidth: 2,
    borderColor: 'tomato',
  },
  text: {
    fontSize: 15,
    color: 'tomato',
    fontWeight: 'bold',
    // textAlign: 'center',
  },
  textChoicer: {
    fontSize: 15,
    fontWeight: 'bold',
    // textAlign: 'center',
  },
  pickerStyle: {
    height: 20, // Adjusted for better visibility
    width: '50%',
    alignSelf: 'center',
  }
})
