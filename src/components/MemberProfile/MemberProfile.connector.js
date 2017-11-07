import { connect } from 'react-redux'
import { bindActionCreators } from 'redux'
import { get } from 'lodash/fp'
import { getPerson, fetchPerson } from './MemberProfile.store'
import makeGoToCommunity from '../../store/actions/makeGoToCommunity'
import getMe from '../../store/selectors/getMe'
import updateUserSettings from '../../store/actions/updateUserSettings'

export function mapStateToProps (state, props) {
  const id = get('navigation.state.params.id', props)
  const editing = get('navigation.state.params.editing', props)

  const person = getPerson(state, {id})
  const goToDetails = () => props.navigation.navigate('MemberDetails', {id})
  const goToEdit = () => props.navigation.navigate('MemberDetails', {id, editing: true})
  const goToSkills = () => props.navigation.navigate('MemberSkillEditor', {id})
  const currentUser = getMe(state, props)
  const isMe = Number(get('id', currentUser)) === Number(id)

  return {
    id,
    editing,
    person,
    currentUser,
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
  const { id, currentUser, person } = stateProps
  const { navigation } = ownProps

  const fetchPerson = () => dispatchProps.fetchPerson(id)

  const canFlag = currentUser && id && currentUser.id !== id

  const onPressMessages = makeOnPressMessages(currentUser, person, navigation)

  return {
    ...stateProps,
    ...dispatchProps,
    ...ownProps,
    canFlag,
    fetchPerson,
    onPressMessages
  }
}

export default connect(mapStateToProps, mapDispatchToProps, mergeProps)
