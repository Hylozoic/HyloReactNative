import React from 'react'
import { Text } from 'react-native'

import WelcomeScene from '../WelcomeScene'
import MenuButton from './MenuButton'
import styles from './styles'

export default class Topics extends React.Component {
  static navigationOptions = ({navigation}) => ({
    headerTitle: <Text style={styles.headerTitle}>Topics</Text>,
    headerLeft: <MenuButton navigation={navigation} />
  })

  render () {
    const { navigation } = this.props
    return <WelcomeScene navigation={navigation} />
  }
}
