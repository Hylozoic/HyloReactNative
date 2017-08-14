import React from 'react'
import { StyleSheet, Text } from 'react-native'

export default function Header (navigation) {
  return {
    headerTitle: <Text style={styles.title}>{navigation.state.params.title}</Text>
  }
}

const styles = StyleSheet.create({
  title: {
    fontFamily: 'Circular-Bold',
    fontSize: 18,
    marginLeft: 10
  }
})
