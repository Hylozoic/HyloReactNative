import React from 'react'
import { StyleSheet, Text } from 'react-native'

export default function Header (navigation) {
  console.log('NAV', navigation)
  return {
    title: navigation.state.params.title,
    headerTitle: navigation.state.params.title
  }
}

const styles = StyleSheet.create({
  title: {}
})
