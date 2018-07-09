import React from 'react'
import { Text, View } from 'react-native'
import Triangle from 'react-native-triangle'
import { white } from 'style/colors'
import { get } from 'lodash/fp'

export default function ErrorBubble ({
  text,
  topArrow,
  bottomArrow,
  customStyles,
  errorRowStyle
}) {
  const backgroundColor = get('backgroundColor', customStyles)
  return <View>
    {topArrow && <ErrorPointer style={styles.topArrow} color={backgroundColor} direction={'up'} />}
    <View style={[styles.row, errorRowStyle]}>
      <Text style={[styles.errorText, customStyles]}>{text}</Text>
    </View>
    {bottomArrow && <ErrorPointer style={styles.bottomArrow} color={backgroundColor} direction={'down'} />}
  </View>
}

export function ErrorPointer ({style, direction, color}) {
  return <Triangle
    width={10}
    height={5}
    style={style}
    direction={direction}
    color={color}
  />
}

const styles = {
  topArrow: {
    marginLeft: 30,
    marginBottom: -1
  },
  bottomArrow: {
    marginLeft: 30,
    marginTop: -1
  },
  errorText: {
    color: 'red',
    textAlign: 'center'
  },
  row: {
    alignSelf: 'stretch',
    marginLeft: 5,
    marginRight: 5,
    backgroundColor: white,
    padding: 10,
    borderRadius: 30
  }
}
