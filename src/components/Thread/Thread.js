import React from 'react'
import { Text, View } from 'react-native'
import { object, func } from 'prop-types'

import Header from './Header'
// import MessageCard from '../MessageCard'
import styles from './Thread.styles.js'

export default class Thread extends React.Component {
  static propTypes = {
    currentUser: object,
    thread: object,
    fetchThread: func
  }

  static navigationOptions = ({ navigation }) => Header(navigation)

  componentDidMount () {
    this.props.fetchThread()
  }

  render () {
    return <View>
      <Text>Hi.</Text>
    </View>
  }
}
