import { connect } from 'react-redux'
import { bindActionCreators } from 'redux'
import { createSelector } from 'reselect'
import getMe from 'store/selectors/getMe'
import { updateMembershipSettings, updateAllMemberships } from './NotificationSettings.store'
import getMemberships from 'store/selectors/getMemberships'
import updateUserSettings from 'store/actions/updateUserSettings'
import { every, includes } from 'lodash/fp'

export const getMessageSettings = createSelector(
  getMe,
  me => me && ({
    sendEmail: includes(me.settings.dmNotifications, ['email', 'both']),
    sendPushNotifications: includes(me.settings.dmNotifications, ['push', 'both'])
  })
)

export const getAllGroupsSettings = createSelector(
  getMemberships,
  memberships => ({
    sendEmail: every(m => m.settings.sendEmail, memberships),
    sendPushNotifications: every(m => m.settings.sendPushNotifications, memberships)
  })
)

export function mapStateToProps (state, props) {
  return {
    messageSettings: getMessageSettings(state, props),
    memberships: getMemberships(state, props),
    allGroupsSettings: getAllGroupsSettings(state, props)
  }
}

export function mapDispatchToProps (dispatch, props) {
  return {
    ...bindActionCreators({
      updateUserSettings,
      updateMembershipSettings,
      updateAllMemberships
    }, dispatch)
  }
}

export default connect(mapStateToProps, mapDispatchToProps)
