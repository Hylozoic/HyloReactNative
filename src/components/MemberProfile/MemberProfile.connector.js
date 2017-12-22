import { connect } from 'react-redux'
import { bindActionCreators } from 'redux'
import { get } from 'lodash/fp'
import { FETCH_PERSON, clearFetchPersonPending, getPerson, fetchPerson } from './MemberProfile.store'
import makeGoToCommunity from '../../store/actions/makeGoToCommunity'
import getMe from '../../store/selectors/getMe'
import updateUserSettings from '../../store/actions/updateUserSettings'
import { getSkillsFromOrm as getSkills } from '../SkillEditor/SkillEditor.store'

export function mapStateToProps (state, props) {
  const { pending } = state
  const id = get('navigation.state.params.id', props)
  const editing = get('navigation.state.params.editing', props)

  const person = getPerson(state, {id})
  const goToDetails = () => props.navigation.navigate('MemberDetails', {id})
  const goToEdit = () => props.navigation.navigate('MemberDetails', {id, editing: true})
  const goToSkills = () => props.navigation.navigate('MemberSkillEditor', {id})
  const currentUser = getMe(state, props)
  const skills = getSkills(state, props)
  const isMe = Number(get('id', currentUser)) === Number(id)

  return {
    id,
    editing,

    // This copes with brief moments where a request is being sent but
    // pendingMiddleware has not yet set pending state.
    pending: pending[FETCH_PERSON] === undefined || pending[FETCH_PERSON],

    person,
    currentUser,
    skills,
    goToDetails,
    goToEdit,
    goToSkills,
    isMe
  }
}

export function mapDispatchToProps (dispatch, props) {
  return {
    goToCommunity: makeGoToCommunity(dispatch, props.navigation),
    ...bindActionCreators({
      clearFetchPersonPending,
      fetchPerson,
      updateUserSettings
    }, dispatch)
  }
}

export function makeOnPressMessages (currentUser, person, navigation) {
  if (!person || currentUser.id === person.id) return () => navigation.navigate('ThreadList')
  const { messageThreadId } = person
  if (messageThreadId) return () => navigation.navigate('Thread', {id: messageThreadId})
  return () => navigation.navigate('NewMessage', {participants: [person.id]})
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

  const goToMemberProfile = () => navigation.navigate('MemberProfile', {id})

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
