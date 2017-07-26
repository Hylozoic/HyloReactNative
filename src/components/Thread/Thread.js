import React from 'react'
import { Text, View } from 'react-native'
import { any, arrayOf, func, shape, string } from 'prop-types'

import Header from './Header'
import MessageCard from '../MessageCard'
import styles from './Thread.styles.js'

export default class Thread extends React.Component {
  static propTypes = {
    messages: arrayOf(shape({
      id: any,
      createdAt: string,
      text: string,
      creator: shape({
        id: any,
        name: string,
        avatarUrl: string
      })
    })),
    fetchMessages: func
  }

  static navigationOptions = ({ navigation }) => Header(navigation)

  componentDidMount () {
    this.props.fetchMessages()
  }

  render () {
    const { messages } = this.props
    return <View>
      {messages.map(message => <MessageCard key={message.id} message={message}/>)}
    </View>
  }
}
