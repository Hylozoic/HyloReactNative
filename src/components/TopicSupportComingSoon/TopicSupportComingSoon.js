import React from 'react'
import { View, Text, Image, TouchableOpacity } from 'react-native'
import styles from './TopicSupportComingSoon.styles'
import header, { tintColor } from 'navigation/header'
import { HeaderBackButton } from '@react-navigation/stack'
import { get } from 'lodash/fp'

const axolotlImage = require('../../assets/Axolotyl_Digging.png')

const goBack = ({ navigation, route }) => () => {
  const onBack = get('params.onBack', route)
  navigation.goBack()
  onBack && onBack()
}

export default class TopicSupportComingSoon extends React.Component {
  static navigationOptions = ({ navigation, route }) => {
    const onPress = goBack(navigation, route)
    return header(navigation, route, {
      options: {
        headerLeft: () =>
          <HeaderBackButton onPress={onPress} tintColor={tintColor} />,
        headerBackTitle: null
      }
    })
  }

  render () {
    const { style, navigation } = this.props

    return (
      <View style={[style, styles.container]}>
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
          <TouchableOpacity onPress={goBack(navigation)} style={styles.goBackButton}>
            <Text style={styles.goBackButtonText}>Go Back</Text>
          </TouchableOpacity>
        </View>
      </View>
    )
  }
}
