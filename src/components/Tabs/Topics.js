import React from 'react'

import WelcomeScene from '../WelcomeScene'
import MenuButton from './MenuButton'

export default class Topics extends React.Component {
  static navigationOptions = ({navigation}) => ({
    title: 'Topics',
    headerLeft: <MenuButton navigation={navigation} />
  })

  render () {
    const { navigation } = this.props
    return <WelcomeScene navigation={navigation} />
  }
}
