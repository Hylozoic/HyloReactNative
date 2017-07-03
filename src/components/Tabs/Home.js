import React from 'react'

import Feed from '../Feed'
import MenuButton from './MenuButton'

export default class Home extends React.Component {
  static navigationOptions = ({navigation}) => ({
    title: 'Home',
    headerLeft: <MenuButton navigation={navigation} />
  })

  render () {
    return <Feed />
  }
}
