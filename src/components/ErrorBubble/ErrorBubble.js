import React from 'react'
import { Text, View } from 'react-native'
import Triangle from 'react-native-triangle'
import { white } from 'style/colors'

export default function ErrorBubble ({
  customStyles,
  text,
  topArrow,
  bottomArrow
}) {
  const styles = customStyles || defaultStyles
  return <View>
    {topArrow && <ErrorPointer style={styles.topArrow} direction={'up'} />}
    <View style={styles.row}>
      <Text style={styles.errorText}>{text}</Text>
    </View>
    {bottomArrow && <ErrorPointer style={styles.bottomArrow} direction={'down'} />}
  </View>
}

export function ErrorPointer ({style, direction}) {
  return <Triangle
    width={10}
    height={5}
    style={style}
    direction={direction}
  />
}

const defaultStyles = {
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
