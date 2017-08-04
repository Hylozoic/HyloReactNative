import React from 'react'
import { Keyboard, Platform, ScrollView, StyleSheet, Text, View } from 'react-native'
import { any, arrayOf, func, shape, string } from 'prop-types'
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
    setTitle: func,
    title: string
  }

  static navigationOptions = ({ navigation }) => Header(navigation)

  constructor () {
    super()
    this.state = {
      inputValue: '',
    }
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
      if (deltaLength === 1
        && get('creator.id', latest) !== currentUser.id
        && !this.atBottom(this.list)) {
          this.newMessages++
          this.notify = true
          return
        }

      this.shouldScroll = true
    }
  }

  componentDidUpdate (prevProps) {
    const { setTitle, title } = this.props
    if (prevProps.title !== title) setTitle(title)
    if (this.shouldScroll) this.scrollToEnd()
    if (this.state.inputValue === 'show' && !this.state.notify) this.toggleModal()
  }

  scrollToEnd = () => {
    this.container.scrollToEnd()
    this.shouldScroll = false
  }

  createMessage = () => {
    this.props.createMessage(this.state.inputValue)
    this.setState({ inputValue: '' })
  }

  toggleModal () {
    this.setState({
      notify: !this.state.notify
    })
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
      <NotificationOverlay
        message={`${this.newMessages} NEW MESSAGES`}
        visible={this.notify} />
    </View>
  }

  render () {
    if (this.props.pending || !this.props.messages) return <Loading />
    return Platform.isIOS
      ? <KeyboardAvoidingView style={styles.container}>{this.messageView()}</KeyboardAvoidingView>
      : this.messageView()
  }
}
