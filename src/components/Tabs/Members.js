import React from 'react'

import WelcomeScene from '../WelcomeScene'
import Header from './Header'

export default class Members extends React.Component {
  static navigationOptions = ({navigation}) => (Header(navigation))
  render () {
    const { navigation } = this.props
    return <WelcomeScene navigation={navigation} />
  }
}
