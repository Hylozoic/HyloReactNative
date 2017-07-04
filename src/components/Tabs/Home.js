import React from 'react'
import { Text } from 'react-native'

import Feed from '../Feed'
import MenuButton from './MenuButton'

export default class Home extends React.Component {
  static navigationOptions = ({navigation}) => ({
    headerTitle: <Text style={{
      alignSelf: 'center',
      marginLeft: -40,
      fontWeight: '900',
      fontSize: 18
    }}>Home</Text>,
    headerLeft: <MenuButton navigation={navigation} />
  })

  render () {
    return <Feed navigation={this.props.navigation} />
  }
}
