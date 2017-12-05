import React from 'react'
import { View, Text, Image, TouchableOpacity } from 'react-native'
import styles from './TopicSupportComingSoon.styles'

const axolotlImage = require('../../assets/Axolotyl_Digging.png')

export default function TopicSupportComingSoon ({ style, navigation }) {
  return <View style={[style, styles.container]}>
    <View style={styles.header}>
      <Text style={styles.headerText}>
        We're working on expanding #topics to more places.
      </Text>
    </View>
    <View style={styles.paddedRow}>
      <Text style={styles.bodyText}>
        In the meantime, click a #topic from an individual
        community to see posts from that community.
      </Text>
    </View>
    <Image style={styles.image} resizeMode='stretch' source={axolotlImage} />
    <View style={styles.paddedRow}>
      <TouchableOpacity onPress={() => navigation.goBack()} style={styles.gotBackButton}>
        <Text style={styles.gotBackButtonText}>Go Back</Text>
      </TouchableOpacity>
    </View>
  </View>
}
