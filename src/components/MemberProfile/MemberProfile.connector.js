import { connect } from 'react-redux'
import { bindActionCreators } from 'redux'
import { get } from 'lodash/fp'
import { getPerson, fetchPerson } from './MemberProfile.store'
import blockUser from '../../store/actions/blockUser'
import makeGoToCommunity from '../../store/actions/makeGoToCommunity'
import getMe from '../../store/selectors/getMe'
import getBlockedUsers from '../../store/selectors/getBlockedUsers'
import updateUserSettings from '../../store/actions/updateUserSettings'
import { mapWhenFocused, mergeWhenFocused } from 'util/connector'

export function mapStateToProps (state, props) {
  const id = get('navigation.state.params.id', props)
  const editing = get('navigation.state.params.editing', props)

  const isBlocked = !!getBlockedUsers(state).find(i => get('id', i) === id)
  const person = getPerson(state, {id})
  const goToDetails = () => props.navigation.navigate('MemberDetails', { id })
  const goToEdit = () => props.navigation.navigate('MemberDetails', { id, editing: true })
  const goToSkills = () => props.navigation.navigate('MemberSkillEditor', { id } )
  const currentUser = getMe(state, props)
  const skills = person ? person.skills : []
  const isMe = Number(get('id', currentUser)) === Number(id)
  const navigation = props.navigation

  return {
    isBlocked,
    id,
    editing,
    person,
    currentUser,
    skills,
    goToDetails,
    goToEdit,
    goToSkills,
    isMe,
    navigation
  }
}

export function mapDispatchToProps (dispatch, props) {
  return {
    goToCommunity: makeGoToCommunity(dispatch, props.navigation),
    ...bindActionCreators({
      fetchPerson,
      updateUserSettings,
      blockUser
    }, dispatch)
  }
}

export function makeOnPressMessages (currentUser, person, navigation) {
  if (!person || currentUser.id === person.id) return () => navigation.navigate('ThreadList')
  const { messageThreadId } = person
  if (messageThreadId) return () => navigation.navigate('Thread', { id: messageThreadId })
  return () => navigation.navigate('NewMessage',{ participants: [person.id] })
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

  const goToMemberProfile = () => navigation.navigate('MemberProfile', { id })

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

export default connect(
  mapWhenFocused(mapStateToProps),
  mapWhenFocused(mapDispatchToProps),
  mergeWhenFocused(mergeProps)
)
