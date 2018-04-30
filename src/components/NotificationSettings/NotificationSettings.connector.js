import { connect } from 'react-redux'
import { bindActionCreators } from 'redux'
import { createSelector } from 'reselect'
import getMe from '../../store/selectors/getMe'
import { updateMembershipSettings, getMemberships } from './NotificationSettings.store'
import { every } from 'lodash/fp'

export const getUserSettings = createSelector(
  getMe,
  me => me && ({
    settings: me.settings
  })
)

export const getAllCommunitiesSettings = createSelector(
  getMemberships,
  memberships => ({
    sendEmail: every(m => m.settings.sendEmail, memberships),
    sendPushNotifications: every(m => m.settings.sendPushNotifications, memberships)
  })
)

export function mapStateToProps (state, props) {
  return {
    settings: getUserSettings(state, props),
    memberships: getMemberships(state, props),
    allCommunitiesSettings: getAllCommunitiesSettings(state, props)
  }
}

export function mapDispatchToProps (dispatch, props) {
  return {
    updateUserSettings: changes => console.log('updateUserSettings', changes),
    ...bindActionCreators({
      updateMembershipSettings
    }, dispatch)
  }
}

export default connect(mapStateToProps, mapDispatchToProps)
