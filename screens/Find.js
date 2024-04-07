import { StyleSheet, Text, TextInput, View } from 'react-native'
import React, {useState} from 'react'
import PressableButton from '../components/PressableButton'

const Find = () => {
  const [searchKeyword, setSearchKeyword] = useState('');
  const [searchDistance, setSearchDistance] = useState(5);
  const [searchRating, setSearchRating] = useState(4);

  return (
    <View style={styles.container}>
      <TextInput style={styles.TextInput} 
        placeholder='Search for restaurants' 
        onChangeText={setSearchKeyword}
        value={searchKeyword}
      />
      
    </View>
  )
}

export default Find

const styles = StyleSheet.create({
  container: {
    flex: 1,
    // justifyContent: 'center',
    // alignItems: 'center'
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
  }
})