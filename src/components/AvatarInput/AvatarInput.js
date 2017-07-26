import React from 'react'
import { StyleSheet, Text, TextInput, View } from 'react-native'
import { any, func, object, shape, string } from 'prop-types'

import Avatar from '../Avatar'

import { rhino30 } from '../../style/colors'
import styles from './AvatarInput.style'

export default function AvatarInput (props) {
  const inputProps = {
    ...props,
    placeholderTextColor: rhino30,
    underlineColorAndroid: 'transparent',
    returnKeyLabel: 'send',
    style: styles.input
  }
  return <View style={styles.container}>
    <Avatar avatarUrl={props.avatarUrl} />
    <TextInput { ...inputProps } />
  </View>
}

AvatarInput.propTypes = {
  avatarUrl: string
}
