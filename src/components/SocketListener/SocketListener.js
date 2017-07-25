import React from 'react'
import { getSocket, socketUrl } from 'util/websockets'

export default class SocketListener extends React.Component {
  constructor (props) {
    super(props)
    this.handlers = {
      commentAdded: props.receiveComment,
      messageAdded: props.receiveMessage,
      newNotification: props.receiveNotification,
      newPost: props.receivePost,
      newThread: props.receiveThread,
      userTyping: this.userTypingHandler
    }
  }

  componentDidMount () {
    getSocket().then(socket => {
      this.socket = socket
      this.props.setupCoreEventHandlers(socket)
      this.reconnect()
      Object.keys(this.handlers).forEach(socketEvent =>
        this.socket.on(socketEvent, this.handlers[socketEvent]))
    })
  }

  componentWillUnmount () {
    this.socket.post(socketUrl('/noo/threads/unsubscribe'))
    Object.keys(this.handlers).forEach(socketEvent =>
      this.socket.off(socketEvent, this.handlers[socketEvent]))
  }

  render () {
    return null
  }

  reconnect = () => {
    this.socket.post(socketUrl('/noo/threads/subscribe'), (body, jwr) => {
      console.log('got response from subscribe:', body)
    })
  }

  userTypingHandler = ({userId, userName, isTyping}) => {
    const { addUserTyping, clearUserTyping } = this.props
    isTyping ? addUserTyping(userId, userName) : clearUserTyping(userId)
  }
}
