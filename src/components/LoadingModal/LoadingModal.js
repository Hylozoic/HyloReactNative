import React from 'react'
import {
  View
} from 'react-native'
import Loading from '../Loading'
import styles from './LoadingModal.styles'

export default function LoadingModal ({ display }) {
  if (!display) return null
  return <View style={styles.container}>
    <Loading />
  </View>
}
