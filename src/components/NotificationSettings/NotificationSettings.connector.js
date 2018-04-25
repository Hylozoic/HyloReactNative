import { connect } from 'react-redux'
// import { bindActionCreators } from 'redux'
import { createSelector } from 'reselect'
import getMe from '../../store/selectors/getMe'

export const getPresentedMe = createSelector(
  getMe,
  me => me && ({
    settings: me.settings,
    memberships: me.memberships.toModelArray()
  })
)

export function mapStateToProps (state, props) {
  return {
    currentUser: getPresentedMe(state, props)
  }
}

export function mapDispatchToProps (dispatch, props) {
  return {
    updateUserSettings: changes => console.log('updateUserSettings', changes),
    updateMembershipSettings: (communityId, changes) => console.log('update memberships settings for', communityId, 'with', changes)
  }
}

export default connect(mapStateToProps, mapDispatchToProps)
