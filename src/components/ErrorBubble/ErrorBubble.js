import React from 'react'
import { Text, View } from 'react-native'
import Triangle from 'react-native-triangle'
import { white } from 'style/colors'

export default function ErrorBubble ({
  customStyles,
  text
}) {
  const styles = customStyles || defaultStyles
  return <View>
    <View style={styles.row}>
      <Text style={styles.errorText}>{text}</Text>
    </View>
    <Triangle
      style={styles.triangle}
      width={10}
      height={5}
      direction='up' />
  </View>
}

const defaultStyles = {
  triangle: {
    marginLeft: 30,
    marginTop: -45
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
    marginBottom: 3,
    marginTop: 8,
    borderRadius: 30
  }
}
