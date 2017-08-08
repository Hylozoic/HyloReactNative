import React from 'react'
import { Keyboard, Platform, ScrollView, StyleSheet, Text, View } from 'react-native'
import { any, arrayOf, func, number, shape, string } from 'prop-types'
import { get } from 'lodash/fp'

import AvatarInput from '../AvatarInput'
import Header from './Header'
import Loading from '../Loading'
import MessageCard from '../MessageCard'
import NotificationOverlay from '../NotificationOverlay'

import styles from './Thread.styles.js'

export default class Thread extends React.Component {
  static propTypes = {
    createMessage: func,
    fetchMessages: func,
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
    pageSize: number,
    setTitle: func,
    title: string
  }

  static navigationOptions = ({ navigation }) => Header(navigation)

  constructor () {
    super()
    this.newMessages = 0
    this.notify = false
  }

  componentDidMount () {
    const { fetchMessages, setTitle, title } = this.props
    this.props.fetchMessages()
    if (title) setTitle(title)
  }

  componentWillUpdate (nextProps) {
    const { currentUser, messages, pending } = nextProps
    const { pageSize } = this.props

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
      // ThreadList always loads one message into the ORM. This masks the
      // initial update from server, hence we check for exactly n === pageSize
      if (get('id', latest) === get('id', oldLatest) && messages.length !== pageSize) return

      // If there's one new message, it's not from currentUser,
      // and we're not already at the bottom, don't scroll
      if (deltaLength === 1
        && !this.atBottom()
        && get('creator.id', latest) !== currentUser.id) {
          this.newMessages++
          this.notify = true
          return
        }

      this.shouldScroll = true
    }
  }

  atBottom = () => {
  // atBottom = ({ offsetHeight, scrollHeight, scrollTop }) => {
    console.log('SCROLL VALS', offsetHeight, scrollHeight, scrollTop, 'atBottom', scrollHeight - scrollTop - offsetHeight < 1)
    return scrollHeight - scrollTop - offsetHeight < 1
  }

  componentDidUpdate (prevProps) {
    const { setTitle, title } = this.props
    if (prevProps.title !== title) setTitle(title)

    // Wait until messages are drawn before scrolling
    if (this.shouldScroll) requestAnimationFrame(() => this.scrollToEnd())
  }

  scrollHandler = ({ nativeEvent }) => {
    // console.log('SCROLL', nativeEvent)
  }

  scrollToEnd = () => {
    if (this.messageList) this.messageList.scrollToEnd()
    this.notify = false
    this.newMessages = 0
  }

  createMessage = ({ nativeEvent }) => {
    this.props.createMessage(nativeEvent.text)
    this.avatarInput.clear()
  }

  messageView = () => {
    const { currentUser, messages, createMessage } = this.props
    return <View style={styles.container}>
      <ScrollView
        ref={sv => this.messageList = sv}
        onScroll={this.scrollHandler}
        style={styles.messageList}>
        {messages.map(message => <MessageCard key={message.id} message={message} />)}
      </ScrollView>
      <AvatarInput
        avatarUrl={currentUser.avatarUrl}
        blurOnSubmit
        multiline
        onSubmitEditing={this.createMessage}
        placeholder='Write something...'
        ref={ai => this.avatarInput = ai}
        scrollParentToEnd={this.scrollToEnd} />
      {this.notify && <NotificationOverlay
        message={`${this.newMessages} NEW MESSAGES`}
        onPress={this.scrollToEnd} />}
    </View>
  }

  render () {
    if (!this.props.messages) return <Loading />
    return Platform.isIOS
      ? <KeyboardAvoidingView style={styles.container}>{this.messageView()}</KeyboardAvoidingView>
      : this.messageView()
  }
}
