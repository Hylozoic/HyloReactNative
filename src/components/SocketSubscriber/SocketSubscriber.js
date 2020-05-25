import React from 'react'
import { func } from 'prop-types'

export default class SocketSubscriber extends React.PureComponent {
  static propTypes = {
    subscribe: func.isRequired,
    unsubscribe: func.isRequired
  }

  setup () {
    // see the connector to understand why this is called "reconnectHandler"
    this.props.subscribe().then(handler => { this.reconnectHandler = handler })
  }

  teardown () {
    this.props.unsubscribe(this.reconnectHandler)
  }

  componentDidMount () {
    this.setup()
  }

  UNSAFE_componentWillReceiveProps (nextProps) {
    if (this.props.id !== nextProps.id) this.teardown()
  }

  componentDidUpdate (prevProps) {
    if (this.props.id && this.props.id !== prevProps.id) {
      this.setup()
    }
  }

  componentWillUnmount () {
    this.teardown()
  }

  render () {
    return null
  }
}
