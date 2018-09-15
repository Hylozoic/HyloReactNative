import { connect } from 'react-redux'
import { createSelector } from 'reselect'
import { get } from 'lodash/fp'
import { FETCH_CURRENT_USER } from '../../store/constants'
import getMe from '../../store/selectors/getMe'
import unBlockUser from '../../store/actions/unBlockUser'

export const getBlockedUsers = createSelector(
  getMe,
  me => get('blockedUsers', me) ? get('blockedUsers', me).toRefArray() : []
)

export function mapStateToProps (state, props) {
  return {
    blockedUsers: getBlockedUsers(state),
    loading: !getMe(state)
  }
}

const mapDispatchToProps = {
  unBlockUser
}

export default connect(mapStateToProps, mapDispatchToProps)
