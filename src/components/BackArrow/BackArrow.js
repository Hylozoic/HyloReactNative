import React from 'react'
import {
  TouchableOpacity,
  Image
} from 'react-native'
import styles from './BackArrow.styles'

const BackImage = require('../../assets/Back.png')

export default function BackArrow ({navigation}) {
  return <TouchableOpacity onPress={() => navigation.goBack()}><Image style={styles.backIcon} source={BackImage} /></TouchableOpacity>
}
