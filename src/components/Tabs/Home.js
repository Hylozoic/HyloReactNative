import React from 'react'

import Feed from '../Feed'
import header from './header'

const title = 'Home'

export default class Home extends React.Component {
  static navigationOptions = ({navigation}) => (header(navigation, title))
  render () {
    return <Feed navigation={this.props.navigation} />
  }
}
