import { connect } from 'react-redux'
import { bindActionCreators } from 'redux'
import { get } from 'lodash/fp'
import { fetchPerson } from './MemberProfile.store'
import blockUser from 'store/actions/blockUser'
import makeGoToGroup from 'store/actions/makeGoToGroup'
import getMe from 'store/selectors/getMe'
import getPerson from 'store/selectors/getPerson'
import getBlockedUsers from 'store/selectors/getBlockedUsers'
import updateUserSettings from 'store/actions/updateUserSettings'
import { mapWhenFocused, mergeWhenFocused } from 'util/redux'
import getCurrentGroup from 'store/selectors/getCurrentGroup'
import { logout } from 'screens/Login/actions'

export function mapStateToProps (state, props) {
  const currentUser = getMe(state, props)
  const currentGroup = getCurrentGroup(state, props)
  const id = get('route.params.id', props)
  const person = id
    ? getPerson(state, { personId: id })
    : currentUser
  const isMe = Number(get('id', currentUser)) === Number(get('id', person))

  const editing = get('route.params.editing', props)
  const isBlocked = !!getBlockedUsers(state).find(i => get('id', i) === id)
  const goToDetails = () => props.navigation.navigate('MemberDetails', { id })
  const goToEdit = () => props.navigation.navigate('MemberDetails', { id, editing: true })
  const goToEditAccount = () => props.navigation.navigate('Edit Account Info')
  const goToSkills = () => props.navigation.navigate('MemberSkillEditor', { id })
  const navigation = props.navigation

  return {
    isBlocked,
    id,
    editing,
    person,
    currentUser,
    currentGroup,
    goToDetails,
    goToEdit,
    goToEditAccount,
    goToSkills,
    isMe,
    navigation
  }
}

export function mapDispatchToProps (dispatch, props) {
  return {
    goToGroup: makeGoToGroup(),
    ...bindActionCreators({
      fetchPerson,
      updateUserSettings,
      blockUser,
      logout
    }, dispatch)
  }
}

export function makeOnPressMessages (currentUser, person, navigation) {
  if (!person || currentUser.id === person.id) return () => navigation.navigate('Messages')
  const { messageThreadId } = person
  if (messageThreadId) return () => navigation.navigate('Messages', { screen: 'Thread', params: { id: messageThreadId }})
  return () => navigation.navigate('Messages', { screen: 'New Message', params: { participantIds: [person.id] } })
}

export function mergeProps (stateProps, dispatchProps, ownProps) {
  const { id, currentUser, person, isMe } = stateProps
  const { navigation } = ownProps

  const fetchPerson = () => dispatchProps.fetchPerson(id)

  const canFlag = currentUser && id && currentUser.id !== id

  const onPressMessages = makeOnPressMessages(currentUser, person, navigation)

  // only call updateUserSettings if isMe (otherwise when you visit another
  // user and then press the back button, you will update your profile with their
  // settings)
  const updateUserSettings = isMe ? dispatchProps.updateUserSettings : () => {}

  const goToMemberProfile = () => navigation.navigate('Member', { id })

  return {
    ...stateProps,
    ...dispatchProps,
    ...ownProps,
    updateUserSettings,
    canFlag,
    fetchPerson,
    onPressMessages,
    goToMemberProfile
  }
}

export default connect(mapStateToProps, mapDispatchToProps, mergeProps)
