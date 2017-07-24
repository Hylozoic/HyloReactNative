import React from 'react'
import { StyleSheet, Text } from 'react-native'

export default function Header (navigation) {
  const { goBack } = navigation

  return {
    headerTitle: <Text style={styles.title}>Thread</Text>,
  }
}

const styles = StyleSheet.create({
  title: {}
})
