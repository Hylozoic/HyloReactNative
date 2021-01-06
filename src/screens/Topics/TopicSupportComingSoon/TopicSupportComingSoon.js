import React from 'react'
import { View, Text, Image } from 'react-native'
import SafeAreaView from 'react-native-safe-area-view'
import LinkButton from 'navigation/linking/LinkButton'
import styles from './TopicSupportComingSoon.styles'

const axolotlImage = require('assets/Axolotyl_Digging.png')

export default function TopicSupportComingSoon ({ style, navigation }) {
  return (
    <SafeAreaView style={[style, styles.container]}>
      <View style={styles.header}>
        <Text style={styles.headerText}>
          We're working on expanding #topics to more places.
        </Text>
      </View>
      <View style={styles.paddedRow}>
        <Text style={styles.bodyText}>
          In the meantime, click a #topic from an individual community to see posts from that community.
        </Text>
      </View>
      <Image style={styles.image} resizeMode='contain' source={axolotlImage} />
      <View style={styles.paddedRow}>
        <LinkButton to='/' style={styles.goBackButton}>
          <Text style={styles.goBackButtonText}>Go Back</Text>
        </LinkButton>
      </View>
    </SafeAreaView>
  )
}
