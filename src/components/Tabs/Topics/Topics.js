import React from 'react'
import { Text, ScrollView, Image, View } from 'react-native'
import KeyboardFriendlyView from '../../KeyboardFriendlyView'
import Header from '../Header'
import styles from './Topics.styles'

const title = 'Topics'

export default class Topics extends React.Component {
  static navigationOptions = ({navigation}) => (Header(navigation, title))

  render () {
    const { community } = this.props
    const { bannerUrl, name } = community
    const image = {uri: bannerUrl}
    
    return <KeyboardFriendlyView style={styles.container}>
      <ScrollView contentContainerStyle={styles.scrollContainer}>
        <Image source={image} style={styles.image} />
        <View style={styles.imageOverlay} />
        <Text style={styles.title}>{name}</Text>
      </ScrollView>
    </KeyboardFriendlyView>
  }
}
