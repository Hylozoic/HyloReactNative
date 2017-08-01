import React from 'react'
import { Keyboard, Platform, ScrollView, StyleSheet, View } from 'react-native'
import { any, arrayOf, func, shape, string } from 'prop-types'

import AvatarInput from '../AvatarInput'
import Header from './Header'
import Loading from '../Loading'
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
    createMessage: func,
    fetchMessages: func
  }

  static navigationOptions = ({ navigation }) => Header(navigation)

  constructor () {
    super()
    this.state = { inputValue: '' }
  }

  componentWillMount () {
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

  createMessage = () => {
    this.props.createMessage(this.state.inputValue)
    this.setState({ inputValue: '' })
  }

  messageView = () => {
    const { avatarUrl, messages, createMessage } = this.props
    return <View style={styles.container}>
      <ScrollView ref={sv => this.container = sv} style={styles.messageList}>
        {messages.map(message => <MessageCard key={message.id} message={message} />)}
      </ScrollView>
      <AvatarInput
        avatarUrl={avatarUrl}
        blurOnSubmit
        multiline
        onChangeText={text => this.setState({ inputValue: text })}
        onSubmitEditing={this.createMessage}
        placeholder='Write something...'
        scrollParentToEnd={this.scrollToEnd}
        value={this.state.inputValue} />
    </View>
  }

  render () {
    if (this.props.pending) return <Loading />
    return Platform.isIOS
      ? <KeyboardAvoidingView style={styles.container}>{this.messageView()}</KeyboardAvoidingView>
      : this.messageView()
  }
}
