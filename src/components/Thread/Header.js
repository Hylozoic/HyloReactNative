import React from 'react'
import { StyleSheet, Text } from 'react-native'

export default function Header (navigation) {
  return {
    headerTitle: navigation.state.params.title,
    headerTitleStyle: styles.title
  }
}

const styles = StyleSheet.create({
  title: {
    fontFamily: 'Circular-Bold',
    fontSize: 18,
    marginLeft: 15,

    // Required to avoid font-weight bug where RN goes looking for
    // CustomFontName_bold.ttf, which doesn't exist:
    // https://github.com/react-community/react-navigation/issues/542#issuecomment-283663786
    fontWeight: '200'
  }
})
