import React from 'react'
import { Image, View, Text } from 'react-native'
import styles from './InviteExpired.styles'
const axolotlImage = require('../../assets/Axel_Fretting.png')

export default class InviteExpired extends React.Component {
  static navigationOptions = {
    header: null,
    headerBackTitle: null
  }

  render () {
    return <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.headerText}>Your invite has expired!</Text>
        <Text style={styles.headerText}>Contact your moderator for another one.</Text>
      </View>
      <Image style={styles.image} resizeMode='stretch' source={axolotlImage} />
    </View>
  }
}
