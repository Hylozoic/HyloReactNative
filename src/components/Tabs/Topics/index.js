import React from 'react'
import Header from '../Header'

const title = 'Topics'

export default class Topics extends React.Component {
  static navigationOptions = ({navigation}) => (Header(navigation, title))

  render () {
    const { navigation } = this.props
    return null
  }
}
