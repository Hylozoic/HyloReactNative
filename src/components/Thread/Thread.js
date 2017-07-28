import React from 'react'
import { Keyboard, Platform, ScrollView, StyleSheet } from 'react-native'
import { any, arrayOf, func, shape, string } from 'prop-types'

import AvatarInput from '../AvatarInput'
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

  constructor () {
    super()
    this.keyboardDidShowListener = Keyboard.addListener('keyboardDidShow', this._keyboardDidShow)
  }

  componentDidMount () {
    this.props.fetchMessages()
  }

  componentWillUnmount () {
    this.keyboardDidShowListener.remove()
  }

  _keyboardDidShow = () => this.container.scrollToEnd()

  scrollToEnd = () => this.container.scrollToEnd()

  messageView = () => {
    const { avatarUrl, messages } = this.props
    return <ScrollView ref={sv => this.container = sv} style={styles.container}>
      {messages.map(message => <MessageCard key={message.id} message={message} />)}
      <AvatarInput
        avatarUrl={avatarUrl}
        multiline
        placeholder='Write something...'
        scrollParentToEnd={this.scrollToEnd} />
    </ScrollView>
  }

  render () {
    return Platform.isIOS
      ? <KeyboardAvoidingView style={styles.container}>{this.messageView()}</KeyboardAvoidingView>
      : this.messageView()
  }
}
