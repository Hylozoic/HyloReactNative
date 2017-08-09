import React from 'react'
import { FlatList, Keyboard, Platform, StyleSheet, Text, View } from 'react-native'
import { any, arrayOf, func, number, shape, string } from 'prop-types'
import { throttle, debounce } from 'lodash'
import { get } from 'lodash/fp'

import AvatarInput from '../AvatarInput'
import Header from './Header'
import Loading from '../Loading'
import MessageCard from '../MessageCard'
import NotificationOverlay from '../NotificationOverlay'

import styles from './Thread.styles.js'

export default class Thread extends React.Component {
  static propTypes = {
    createMessage: func.isRequired,
    currentUser: shape({
      id: any,
      avatarUrl: string
    }).isRequired,
    fetchMessages: func.isRequired,
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
    pageSize: number.isRequired,
    pending: any,
    setTitle: func.isRequired,
    updateThreadReadTime: func.isRequired,
    title: string
  }

  static navigationOptions = ({ navigation }) => Header(navigation)

  constructor () {
    super()

    // NOTE: we write directly to the object in quite a few places rather than
    // using setState. This avoids an automatic re-render on scroll, and any
    // inconsistencies owing to the async nature of setState and/or setState
    // batching.
    this.newMessages = 0
    this.notify = false

    // We track our own yOffsets here because FlatList can send nativeEvents in
    // response to scroll, but does not have an API to directly query offset.
    this.messageList = {
      ref: null,
      adjustScroll: false,
      bumpScroll: false,
      firstFetch: true,
      endOffset: 0,
      shouldScroll: false,
      yOffset: 0,
      ySize: 0
    }
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

    this.messageList.shouldScroll = false

    if (deltaLength) {
      const latest = messages[messages.length - 1]
      const oldLatest = oldMessages[oldMessages.length - 1]

      // Are additional messages old (at the beginning of the sorted array)?
      if (get('id', latest) === get('id', oldLatest) && !this.messageList.firstFetch) return

      // If there's one new message, it's not from currentUser,
      // and we're not already at the bottom, don't scroll
      if (deltaLength === 1
        && !this.atBottom()
        && get('creator.id', latest) !== currentUser.id) {
          this.newMessages++
          this.notify = true
          return
        }

      if (this.firstFetch) this.firstFetch = false
      this.messageList.shouldScroll = true
    }
  }

  atBottom = () => this.currentYOffset >= this.bottomYOffset - 1

  componentDidUpdate (prevProps) {
    const { setTitle, title } = this.props
    if (prevProps.title !== title) setTitle(title)
    if (this.messageList.shouldScroll) this.scrollToEnd()

    // TODO: if FlatList starts supporting an API to query the `currentOffset.y`,
    // we can update this to be much more accurate. Here we're setting a value that
    // the scroll handler can use when triggered by `scrollToOffset` to grab the
    // new height of the content and use it to accurately determine the old position.
    // if (this.messageList.bumpScroll) {
    //   this.messageList.adjustScroll = true
    //   this.scrollToOffset(1)
    // }
  }

  endHandler = ({ distanceFromEnd }) =>
    this.messageList.endOffset = distanceFromEnd

  // refreshHandler = () => {
  //   const { fetchMessages, hasMore, messages, pending } = this.props
  //   if (pending || !hasMore) return
  //   this.messageList.bumpScroll = true
  //   this.messageList.oldSize = this.messageList.ySize
  //   fetchMessages(messages[0].id)
  // }

  renderItem = ({ item }) => <MessageCard message={item} />

  detectScrollExtremes = throttle(() => {
    if (this.props.pending) return
    if (this.atBottom()) this.markAsRead()
    if (this.messageList.yOffset <= 150) this.fetchMore()
  }, 500, {trailing: true})

  fetchMore = () => {
    const { fetchMessages, hasMore, messages, pending } = this.props
    if (pending || !hasMore) return
    fetchMessages(messages[0].id)
  }

  markAsRead = debounce(() => updateThreadReadTime(thread.id), 2000)

  scrollHandler = ({ nativeEvent: { contentOffset } }) => {
    this.messageList.yOffset = contentOffset.y
    this.detectScrollExtremes(contentOffset.y)
    // this.messageList.ySize = contentSize.height

    // Fine-tune the new scroll position: we want the old messages[0], prior to fetch.
    // TODO: This percentage-based method is close, but imperfect. Ideally we could
    // scroll the exact message into view at the same position each time, but unless
    // we can fix the height of each message that's always going to come at a cost.
    // if (this.messageList.adjustScroll) {
    //   this.messageList.adjustScroll = false
    //   const heightChange = (contentSize.height - this.messageList.oldSize) / contentSize.height
    //   const newOffset = (heightChange * this.messageList.endOffset) + this.messageList.endOffset
    //   this.scrollToOffset(newOffset)
    // }
  }

  scrollToEnd = () => {
    // NOTE: `requestAnimationFrame` was not sufficient to guarantee all messages were drawn
    // prior to scroll when using FlatList (as opposed to ScrollView). 300ms seems to be
    // about the sweet spot. `scrollToIndex` is not available due to the variable height of
    // each message.
    setTimeout(() => this.messageList.ref.scrollToEnd(), 300)
    this.notify = false
    this.newMessages = 0
  }

  scrollToOffset = offset =>
    setTimeout(() => this.messageList.ref.scrollToOffset({ offset }), 300)

  createMessage = ({ nativeEvent }) => {
    this.props.createMessage(nativeEvent.text)
    this.avatarInput.clear()
  }

  messageView = () => {
    const { createMessage, currentUser, messages, pending } = this.props
    return <View style={styles.container}>
      {pending && <Loading />}
      <FlatList style={styles.messageList}
        data={messages}
        keyExtractor={item => item.id}
        onEndReached={this.endHandler}
        // onRefresh={this.refreshHandler}
        onScroll={this.scrollHandler}
        ref={sv => this.messageList.ref = sv}
        refreshing={!!pending}
        renderItem={this.renderItem} />
      <AvatarInput
        avatarUrl={currentUser.avatarUrl}
        blurOnSubmit
        multiline
        onSubmitEditing={this.createMessage}
        placeholder='Write something...'
        ref={ai => this.avatarInput = ai}
        scrollParentToEnd={this.scrollToEnd} />
      {this.notify && <NotificationOverlay
        message={`${this.newMessages} NEW MESSAGE${this.newMessages > 1 ? 'S' : ''}`}
        onPress={this.scrollToEnd} />}
    </View>
  }

  render () {
    return Platform.isIOS
      ? <KeyboardAvoidingView style={styles.container}>{this.messageView()}</KeyboardAvoidingView>
      : this.messageView()
  }
}
