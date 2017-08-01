import React from 'react'
import { Keyboard, Platform, ScrollView, StyleSheet, View } from 'react-native'
import { any, arrayOf, func, shape, string } from 'prop-types'
import { get } from 'lodash/fp'

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

  componentWillUpdate (nextProps) {
    const { currentUser, messages, pending } = nextProps
    if (pending) return

    const oldMessages = this.props.messages
    const deltaLength = Math.abs(messages.length - oldMessages.length)

    // Note: we write directly to the object here rather than using setState.
    // This avoids an automatic re-render on scroll, and any inconsistencies
    // owing to the async nature of setState and/or setState batching.
    this.shouldScroll = false

    if (deltaLength) {
      const latest = messages[messages.length - 1]
      const oldLatest = oldMessages[oldMessages.length - 1]

      // Are additional messages old (at the beginning of the sorted array)?
      if (get('id', latest) === get('id', oldLatest)) return

      // If there's one new message, it's not from currentUser,
      // and we're not already at the bottom, don't scroll
      if (deltaLength === 1 &&
        get('creator.id', latest) !== currentUser.id &&
        !this.atBottom(this.list)) return

      this.shouldScroll = true
    }
  }

  componentDidUpdate () {
    if (this.shouldScroll) this.container.scrollToEnd()
  }

  _keyboardDidShow = () => this.container.scrollToEnd()

  scrollToEnd = () => this.container.scrollToEnd()

  createMessage = () => {
    this.props.createMessage(this.state.inputValue)
    this.setState({ inputValue: '' })
  }

  messageView = () => {
    const { currentUser, messages, createMessage } = this.props
    return <View style={styles.container}>
      <ScrollView ref={sv => this.container = sv} style={styles.messageList}>
        {messages.map(message => <MessageCard key={message.id} message={message} />)}
      </ScrollView>
      <AvatarInput
        avatarUrl={currentUser.avatarUrl}
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
