import React from 'react'
import { Text } from 'react-native'

import WelcomeScene from '../WelcomeScene'
import MenuButton from './MenuButton'

export default class Topics extends React.Component {
  static navigationOptions = ({navigation}) => ({
    headerTitle: <Text style={{
      alignSelf: 'center',
      marginLeft: -50,
      fontWeight: '900',
      fontSize: 18
    }}>Topics</Text>,
    headerLeft: <MenuButton navigation={navigation} />
  })

  render () {
    const { navigation } = this.props
    return <WelcomeScene navigation={navigation} />
  }
}
