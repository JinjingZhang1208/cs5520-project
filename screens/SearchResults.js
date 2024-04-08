import { StyleSheet, Text, View } from 'react-native'
import React from 'react'
import { useNavigation, useRoute } from '@react-navigation/native'

const SearchResults = () => {
  const route = useRoute(); 
  const { results } = route.params;

  return (
    <View>
      <Text>Search Results</Text>
    </View>
  )
}

export default SearchResults

const styles = StyleSheet.create({})