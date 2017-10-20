import React from 'react'
import {
  View, Text, TouchableOpacity
} from 'react-native'
import Loading from '../Loading'
import styles from './LoadingModal.styles'

export default function LoadingModal ({ display, setLoadingModal }) {
  if (!display) return null
  return <View style={styles.container}>
    <Loading />
    <TouchableOpacity onPress={() => setLoadingModal(false)} ><Text>CLOSE</Text></TouchableOpacity>
  </View>
}
