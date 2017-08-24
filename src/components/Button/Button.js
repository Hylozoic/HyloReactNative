import React from 'react'
import { Text, View, TouchableOpacity } from 'react-native'
import { caribbeanGreen } from 'style/colors'
import { omit } from 'lodash/fp'

export default function Button ({
  style,
  text,
  onPress
 }) {
  const {
    color = 'white',
    backgroundColor = caribbeanGreen,
    fontSize = 13,
    height = 30
  } = style

  const containerStyle = {
    ...styles.container,
    ...omit([
      'color', 'backgroundColor', 'fontSize', 'height'
    ], style)}

  const buttonStyle = {...styles.button, backgroundColor, height}
  const textStyle = {...styles.text, color, fontSize}

  return <View style={containerStyle}>
    <TouchableOpacity onPress={onPress} style={styles.wrapper}>
      <View style={buttonStyle}>
        <Text style={textStyle}>{text}</Text>
      </View>
    </TouchableOpacity>
  </View>
}

const styles = {
  container: {
    alignItems: 'center'
  },
  wrapper: {
    flexDirection: 'row'
  },
  button: {
    justifyContent: 'center',
    alignItems: 'center',
    flex: 1,
    borderRadius: 100
  },
  text: {
    fontFamily: 'Circular-Bold'
  }
}
