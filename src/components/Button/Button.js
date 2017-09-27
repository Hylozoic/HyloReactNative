import React from 'react'
import { Text, View, TouchableOpacity } from 'react-native'
import { caribbeanGreen } from 'style/colors'
import { omit } from 'lodash/fp'

export default function Button ({
  style,
  text,
  onPress,
  disabled
 }) {
  const {
    color = 'white',
    borderColor = 'white',
    fontSize = 13,
    height = 30
  } = style

  const containerStyle = {
    ...styles.container,
    ...omit([
      'color', 'backgroundColor', 'disabledBackgroundColor', 'fontSize', 'height'
    ], style)}

  const backgroundColor = (disabled
    ? style.disabledBackgroundColor
    : style.backgroundColor) || caribbeanGreen

  const buttonStyle = {...styles.button, backgroundColor, height, borderColor}
  const textStyle = {...styles.text, color, fontSize}

  return <View style={containerStyle}>
    <TouchableOpacity disabled={disabled} onPress={disabled ? () => {} : onPress} style={styles.wrapper}>
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
    borderRadius: 100,
    borderWidth: 1
  },
  text: {
    fontFamily: 'Circular-Bold'
  }
}
