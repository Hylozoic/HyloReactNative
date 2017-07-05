import React from 'react'
import { Text } from 'react-native'

import WelcomeScene from '../WelcomeScene'
import MenuButton from './MenuButton'
import styles from './styles'

export default class Members extends React.Component {
  static navigationOptions = ({navigation}) => ({
    headerTitle: <Text style={styles.headerTitle}>Members</Text>,
    headerLeft: <MenuButton navigation={navigation} />
  })

  render () {
    const { navigation } = this.props
    return <WelcomeScene navigation={navigation} />
  }
}
