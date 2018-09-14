import { connect } from 'react-redux'
import { bindActionCreators } from 'redux'
import { createSelector } from 'reselect'
import { get } from 'lodash/fp'
import getMe from '../../store/selectors/getMe'
import fetchCurrentUser from '../../store/actions/fetchCurrentUser'
import { unBlockUser, getBlockedUsers } from './BlockedUsers.store'

export function mapStateToProps (state, props) {
  const blockedUsers = get('blockedUsers', getMe(state))

  return {
    blockedUsers: blockedUsers ? blockedUsers.toRefArray() : []
  }
}

export function mapDispatchToProps (dispatch, props) {
  return {
    ...bindActionCreators({
      unBlockUser,
      fetchCurrentUser
    }, dispatch)
  }
}

export default connect(mapStateToProps, mapDispatchToProps)
