import React from 'react'
import { TextInput, ScrollView } from 'react-native'
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
    return <ScrollView style={styles.container}>
      {messages.map(message => <MessageCard key={message.id} message={message}/>)}
      <TextInput style={styles.input} underlineColorAndroid='transparent' />
    </ScrollView>
  }
}
