import React from 'react'

import WelcomeScene from '../WelcomeScene'
import MenuButton from './MenuButton'

export default class Members extends React.Component {
  static navigationOptions = ({navigation}) => ({
    title: 'Members',
    headerLeft: <MenuButton navigation={navigation} />
  })

  render () {
    const { navigation } = this.props
    return <WelcomeScene navigation={navigation} />
  }
}
