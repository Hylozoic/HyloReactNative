import React, { Component } from 'react'
import PropTypes from 'prop-types'
import mixins from '../../style/mixins'
import Loading from '../Loading'

export default class CheckInvitation extends Component {
  static propTypes = {
    checkInvitation: PropTypes.func.isRequired
  }

  componentDidMount () {
    return this.props.checkInvitation()
  }

  render () {
    return <Loading style={mixins.allCentered} />
  }
}
