import React from 'react'
import { StyleSheet, Text, TouchableOpacity } from 'react-native'

import { rhino60 } from 'style/colors'

export default function Header (navigation) {
  const { title, onPressTitle } = route.params
  return {
    headerTintColor: rhino60,
    headerTitle: <Title title={title} onPress={onPressTitle} />
  }
}

const styles = StyleSheet.create({
  title: {
    color: 'black',
    fontFamily: 'Circular-Bold',
    fontSize: 18,
    marginLeft: 15,

    // Required to avoid font-weight bug where RN goes looking for
    // CustomFontName_bold.ttf, which doesn't exist:
    // https://github.com/react-community/react-navigation/issues/542#issuecomment-283663786
    fontWeight: '200'
  }
})

export function Title ({ title, onPress }) {
  return <TouchableOpacity onPress={onPress}>
    <Text style={styles.title}>{title}</Text>
  </TouchableOpacity>
}
