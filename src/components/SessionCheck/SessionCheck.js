import React from 'react'
import PropTypes from 'prop-types'
import { LoadingScreen } from '../Loading'

export default class SessionCheck extends React.Component {
  static navigationOptions = {
    header: null
  }

  static propTypes = {
    checkSession: PropTypes.func.isRequired
  }

  componentDidMount () {
    this.props.checkSession()
  }

  render () {
    return <LoadingScreen />
  }
}
