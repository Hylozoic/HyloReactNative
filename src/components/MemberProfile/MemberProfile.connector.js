import { connect } from 'react-redux'
import { bindActionCreators } from 'redux'
import { get } from 'lodash/fp'
import { getPerson, fetchPerson, blockUser } from './MemberProfile.store'
import makeGoToCommunity from '../../store/actions/makeGoToCommunity'
import getMe from '../../store/selectors/getMe'
import updateUserSettings from '../../store/actions/updateUserSettings'
import { mapWhenFocused, mergeWhenFocused } from 'util/connector'

export function mapStateToProps (state, props) {
  const id = get('navigation.state.params.id', props)
  const editing = get('navigation.state.params.editing', props)

  const person = getPerson(state, {id})
  const goToDetails = () => props.navigation.navigate({routeName: 'MemberDetails', params: {id}, key: 'MemberDetails'})
  const goToEdit = () => props.navigation.navigate({routeName: 'MemberDetails', params: {id, editing: true}, key: 'MemberDetails'})
  const goToSkills = () => props.navigation.navigate({routeName: 'MemberSkillEditor', params: {id}, key: 'MemberSkillEditor'})
  const currentUser = getMe(state, props)
  const skills = person ? person.skills : []
  const isMe = Number(get('id', currentUser)) === Number(id)
  const navigation = props.navigation

  return {
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
  if (!person || currentUser.id === person.id) return () => navigation.navigate({routeName: 'ThreadList', key: 'ThreadList'})
  const { messageThreadId } = person
  if (messageThreadId) return () => navigation.navigate({routeName: 'Thread', params: {id: messageThreadId}, key: 'Thread'})
  return () => navigation.navigate({routeName: 'NewMessage', params: {participants: [person.id]}, key: 'NewMessage'})
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

  const goToMemberProfile = () => navigation.navigate({routeName: 'MemberProfile', params: {id}, key: 'MemberProfile'})

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
