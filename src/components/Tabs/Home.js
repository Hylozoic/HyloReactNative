import React from 'react'
import { Text } from 'react-native'

import Feed from '../Feed'
import MenuButton from './MenuButton'
import styles from './styles'

export default class Home extends React.Component {
  static navigationOptions = ({navigation}) => ({
    headerTitle: <Text style={styles.headerTitle}>Home</Text>,
    headerLeft: <MenuButton navigation={navigation} />
  })

  render () {
    return <Feed navigation={this.props.navigation} />
  }
}
