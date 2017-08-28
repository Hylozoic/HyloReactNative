import React from 'react'
import { FlatList, KeyboardAvoidingView, View } from 'react-native'
import { any, arrayOf, func, object, shape, string } from 'prop-types'
import { throttle, debounce } from 'lodash'
import { get } from 'lodash/fp'

import Header from './Header'
import Loading from '../Loading'
import MessageCard from '../MessageCard'
import MessageInput from '../MessageInput'
import NotificationOverlay from '../NotificationOverlay'
import PeopleTyping from '../PeopleTyping'
import SocketSubscriber from '../SocketSubscriber'
import { isIOS } from 'util/platform'
import { getSocket } from 'util/websockets'
import { keyboardAvoidingViewProps as kavProps } from 'util/viewHelpers'

import styles from './Thread.styles'

const BOTTOM_THRESHOLD = 10

export default class Thread extends React.Component {
  static propTypes = {
    id: any,
    createMessage: func.isRequired,
    currentUser: string.isRequired,
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
    pending: any,
    reconnectFetchMessages: func,
    setTitle: func.isRequired,
    title: string,
    updateThreadReadTime: func.isRequired
  }

  static navigationOptions = ({ navigation }) => Header(navigation)

  constructor (props) {
    super(props)
    this.state = {
      newMessages: 0,
      notify: false
    }

    // NOTE: we write directly to the object rather than using setState.
    // This avoids an automatic re-render on scroll, and any inconsistencies
    // owing to the async nature of setState and/or setState batching.
    this.yOffset = 0
  }

  componentDidMount () {
    const { fetchMessages, reconnectFetchMessages, setTitle, title } = this.props
    getSocket().then(socket => socket.on('reconnect', reconnectFetchMessages))
    this.scrollToBottom()
    fetchMessages()
    if (title) setTitle(title)
  }

  componentWillUpdate (nextProps) {
    const { currentUser, messages, pending } = nextProps

    const oldMessages = this.props.messages
    const deltaLength = Math.abs(messages.length - oldMessages.length)

    this.shouldScroll = false

    if (deltaLength) {
      const latest = messages[0]
      const oldLatest = oldMessages[0]

      // Are additional messages old (at the beginning of the sorted array)?
      if (get('id', latest) === get('id', oldLatest)) {
        // Stops NotificationOverlay showing on infinite scroll
        if (this.state.notify) this.setState({ notify: false })
        return 
      }

      // If there's one new message, it's not from currentUser,
      // and we're not already at the bottom, don't scroll
      if (deltaLength === 1
        && !this.atBottom()
        && get('creator.id', latest) !== currentUser.id) {
        this.setState({
          newMessages: this.state.newMessages + 1,
          notify: true
        })
        return
      }

      this.shouldScroll = true
    }
  }

  componentDidUpdate (prevProps) {
    const { messages, setTitle, title } = this.props
    if (prevProps.title !== title) setTitle(title)
    if (this.atBottom()) this.markAsRead()
    if (this.shouldScroll) this.scrollToBottom()
  }

  componentWillUnmount () {
    const { reconnectFetchMessages } = this.props
    getSocket().then(socket => socket.off('reconnect', reconnectFetchMessages))
  }

  atBottom = () => this.yOffset < BOTTOM_THRESHOLD

  createMessage = text => this.props.createMessage(text)

  fetchMore = throttle(() => {
    const { fetchMessages, hasMore, messages, pending } = this.props
    if (pending || !hasMore) return
    fetchMessages(messages[messages.length - 1].id)
  }, 2000)

  markAsRead = debounce(() => this.props.updateThreadReadTime(), 2000)

  renderItem = ({ item }) => <MessageCard message={item} />

  scrollHandler = ({ nativeEvent: { contentOffset } }) => {
    this.yOffset = contentOffset.y
    if (contentOffset.y < BOTTOM_THRESHOLD) this.markAsRead()
  }

  // NOTE: This scrolls to the 'perceived' (by the user) bottom of the thread,
  // which is actually the top! Confused? Inverted lists are fun.
  scrollToBottom = () => {
    this.messageList.scrollToOffset({ offset: 0 })
    this.setState({
      newMessages: 0,
      notify: false
    })
    this.markAsRead()
  }

  messageView = () => {
    const {
      id,
      createMessage,
      currentUser,
      messages,
      pending,
      sendIsTyping
    } = this.props
    const { newMessages, notify } = this.state
    return <View style={styles.container}>
      {pending && <Loading />}
      <FlatList style={styles.messageList}
        data={messages}
        keyExtractor={item => item.id}
        onEndReached={() => this.fetchMore()}
        onEndReachedThreshold={0.3}
        onScroll={this.scrollHandler}
        ref={flatList => this.messageList = flatList}
        refreshing={!!pending}
        renderItem={this.renderItem} />
      <MessageInput
        blurOnSubmit={false}
        multiline
        onSubmit={this.createMessage}
        sendIsTyping={sendIsTyping}
        placeholder='Write something...' />
      <PeopleTyping />
      {notify && <NotificationOverlay
        message={`${newMessages} NEW MESSAGE${newMessages > 1 ? 'S' : ''}`}
        onPress={this.scrollToBottom} />}
      <SocketSubscriber type='post' id={id} />
    </View>
  }

  render () {
    return isIOS
      ? <KeyboardAvoidingView style={styles.container} {...kavProps}>
        {this.messageView()}
      </KeyboardAvoidingView>
      : this.messageView()
  }
}
