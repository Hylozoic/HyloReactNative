import React, { Component } from 'react'
import PropTypes from 'prop-types'
import mixins from '../../style/mixins'
import Loading from '../Loading'

export default class CheckInvitation extends Component {
  static propTypes = {
    pending: PropTypes.any,
    isValidInvite: PropTypes.any,
    checkInvitation: PropTypes.func.isRequired,
    navToSignup: PropTypes.func.isRequired,
    navToInviteExpired: PropTypes.func.isRequired
  }

  componentDidMount () {
    const { checkInvitation, navToSignup } = this.props
    return checkInvitation()
    // NOTE: if something fails in the process of checking the
    // invitation the user will be forwarded on to the Signup
    // page given that we don't know if there is an issue (expired)
    // with the invite or if there was just some other issue.
    // SO in this case the user will still be prompted to
    // continue to signup (or login) and JoinCommunity will
    // be tried again upon signing in.
    .catch(err => err && navToSignup())
  }

  componentWillUpdate (nextProps) {
    !nextProps.pending && this._handleResult(nextProps)
  }

  _handleResult (props) {
    const { isValidInvite, navToSignup, navToInviteExpired } = props
    if (isValidInvite) {
      navToSignup()
    } else {
      // NOTE: Not clearing the entryURL (resetEntryURL) on a failed check
      // such that join will still be tried upon login. If the invite code
      // is invalid (not just already used) then the user will be forwarded
      // to the community associated with the already claimed invite.
      navToInviteExpired()
    }
  }

  render () {
    return <Loading style={mixins.allCentered} />
  }
}
