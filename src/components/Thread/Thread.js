import React from 'react'
import { FlatList, Keyboard, Platform, StyleSheet, Text, View } from 'react-native'
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

  atBottom = () => this.yOffset

  componentDidUpdate (prevProps) {
    const { setTitle, title } = this.props
    if (prevProps.title !== title) setTitle(title)
    if (this.shouldScroll) this.scrollToEnd()
  }

  // scrollHandler = ({ nativeEvent: { contentOffset }) => {
  scrollHandler = ({ nativeEvent }) => {
    console.log(nativeEvent)
    // this.yOffset = contentOffset.y
  }

  scrollToEnd = () => {
    const endIndex = this.props.messages.length - 1
    // Wait until messages are drawn before scrolling
    requestAnimationFrame(() => this.messageList.scrollToIndex(endIndex))
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
      <FlatList
        ref={sv => this.messageList = sv}
        data={messages}
        onScroll={this.scrollHandler}
        style={styles.messageList}
        keyExtractor={item => item.id}
        renderItem={({ item }) => <MessageCard message={item} />} />
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
    if (this.props.pending) return <Loading />
    return Platform.isIOS
      ? <KeyboardAvoidingView style={styles.container}>{this.messageView()}</KeyboardAvoidingView>
      : this.messageView()
  }
}
