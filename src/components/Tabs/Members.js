import React from 'react'

import WelcomeScene from '../WelcomeScene'
import header from './header'

const title = 'Members'

export default class Members extends React.Component {
  static navigationOptions = ({navigation}) => (header(navigation, title))

  render () {
    const { navigation } = this.props
    return <WelcomeScene navigation={navigation} />
  }
}
