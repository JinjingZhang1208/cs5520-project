import { StyleSheet, Text, View } from 'react-native'
import React from 'react'
import CommonStyles from '../styles/CommonStyles'

export default function Card({children}) {
  return (
    <View style={CommonStyles.card}>
      {children}
    </View>
  )
}

const styles = StyleSheet.create({})