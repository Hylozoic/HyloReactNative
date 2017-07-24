import { PropTypes, Component } from 'react'
import { getSocket, socketUrl } from 'util/websockets'
const { func, object } = PropTypes

export default class SocketListener extends Component {
  static propTypes = {
    location: object,
    receiveThread: func,
    receiveMessage: func,
    receiveComment: func,
    receiveNotification: func,
    receivePost: func,
    addUserTyping: func,
    clearUserTyping: func
  }

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
