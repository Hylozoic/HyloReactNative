import { connect } from 'react-redux'
import { bindActionCreators } from 'redux'
import { get } from 'lodash/fp'
import { fetchPerson } from './MemberProfile.store'
import { navigateToLinkingPath, openURL } from 'navigation/linking'
import blockUser from 'store/actions/blockUser'
import makeGoToGroup from 'store/actions/makeGoToGroup'
import getMe from 'store/selectors/getMe'
import getPerson from 'store/selectors/getPerson'
import getBlockedUsers from 'store/selectors/getBlockedUsers'
import updateUserSettings from 'store/actions/updateUserSettings'
import getCurrentGroup from 'store/selectors/getCurrentGroup'
import logout from 'store/actions/logout'
import getMemberships from 'store/selectors/getMemberships'

export function mapStateToProps (state, props) {
  const currentUser = getMe(state, props)
  const currentGroup = getCurrentGroup(state, props)
  const memberships = getMemberships(state)
  const id = get('route.params.id', props)
  const person = id
    ? getPerson(state, { personId: id })
    : currentUser
  const isMe = Number(get('id', currentUser)) === Number(get('id', person))
  const navigation = props.navigation
  const { navigate } = navigation
  const editing = get('route.params.editing', props)
  const isBlocked = !!getBlockedUsers(state).find(i => get('id', i) === id)
  const goToDetails = () => navigate('Member Details', { id })
  const goToEdit = () => openURL('/settings')
  const goToEditAccount = () => openURL('/settings/account')
  const goToSkills = () => openURL('/settings')
  const goToManageNotifications = () => openURL('/settings/notifications')
  const goToBlockedUsers = () => openURL('/settings/blocked-users')

  return {
    isBlocked,
    id,
    editing,
    person,
    currentUser,
    currentGroup,
    memberships,
    goToDetails,
    goToEdit,
    goToEditAccount,
    goToSkills,
    goToManageNotifications,
    goToBlockedUsers,
    isMe,
    navigation
  }
}

export function mapDispatchToProps (dispatch, props) {
  return {
    goToGroup: makeGoToGroup(props.navigation, dispatch),
    ...bindActionCreators({
      fetchPerson,
      updateUserSettings,
      blockUser,
      logout
    }, dispatch)
  }
}

export function makeOnPressMessages (currentUser, person, navigation) {
  if (!person || currentUser.id === person.id) return () => navigation.navigate('Messages Tab')

  const { messageThreadId } = person

  if (messageThreadId) return () => navigateToLinkingPath(`/messages/${messageThreadId}`)

  return () => navigateToLinkingPath(`/messages/new?participants=${person.id}`)
}

export function mergeProps (stateProps, dispatchProps, ownProps) {
  const { id, currentUser, currentGroup, memberships, person, isMe } = stateProps
  const { navigation } = ownProps

  const fetchPerson = () => dispatchProps.fetchPerson(id)

  const canFlag = currentUser && id && currentUser.id !== id

  const onPressMessages = makeOnPressMessages(currentUser, person, navigation)

  // only call updateUserSettings if isMe (otherwise when you visit another
  // user and then press the back button, you will update your profile with their
  // settings)
  const updateUserSettings = isMe ? dispatchProps.updateUserSettings : () => {}

  const goToMemberProfile = () => navigation.navigate('Member', { id })
  const goToGroup = groupSlug => dispatchProps.goToGroup(groupSlug, memberships, currentGroup.slug)

  return {
    ...stateProps,
    ...dispatchProps,
    ...ownProps,
    updateUserSettings,
    canFlag,
    fetchPerson,
    onPressMessages,
    goToMemberProfile,
    goToGroup
  }
}

export default connect(mapStateToProps, mapDispatchToProps, mergeProps)
