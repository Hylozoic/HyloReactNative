import React from 'react'

import WelcomeScene from '../WelcomeScene'
import header from './header'

const title = 'Topics'

export default class Topics extends React.Component {
  static navigationOptions = ({navigation}) => (header(navigation, title))

  render () {
    const { navigation } = this.props
    return <WelcomeScene navigation={navigation} />
  }
}
