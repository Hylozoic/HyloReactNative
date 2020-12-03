import React from 'react'
import PropTypes from 'prop-types'

export default class SessionCheck extends React.PureComponent {
  static navigationOptions = {
    headerShown: false
  }

  static propTypes = {
    checkSession: PropTypes.func.isRequired
  }

  state = {}

  componentDidMount () {
    this.props.checkSession().then(() => this.setState({checked: true}))
  }

  render () {
    return this.state.checked ? this.props.children : null
  }
}
