import React from 'react'
import { View, Text, Image, TouchableOpacity } from 'react-native'
import styles from './TopicSupportComingSoon.styles'

const axolotlImage = require('../../assets/Axel_Fretting.png')

export default function TopicSupportComingSoon ({ style, navigation }) {
  console.log('111: ', navigation)
  return <View style={[style, styles.container]}>
    <View style={styles.header}>
      <Text style={styles.headerText}>We're working on expanding #topics to more places.</Text>
      <Text style={styles.headerText}>Contact your moderator for another one.</Text>
    </View>
    <View style={styles.paddedRow}>
      <TouchableOpacity onPress={() => navigation.goBack()} style={styles.gotBackButton}>
        <Text style={styles.gotBackButtonText}>Go Back</Text>
      </TouchableOpacity>
    </View>
    <Image style={styles.image} resizeMode='stretch' source={axolotlImage} />
  </View>
}
