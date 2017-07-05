import React from 'react'

import Feed from '../Feed'
import Header from './Header'

export default class Home extends React.Component {
  static navigationOptions = ({navigation}) => (Header(navigation))
  render () {
    return <Feed navigation={this.props.navigation} />
  }
}
