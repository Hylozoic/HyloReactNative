import { connect } from 'react-redux'
import { get } from 'lodash/fp'
import { getPerson, fetchPerson } from './MemberProfile.store'
import makeGoToCommunity from '../../store/actions/makeGoToCommunity'
import getMe from '../../store/selectors/getMe'

export function mapStateToProps (state, props) {
  const id = get('navigation.state.params.id', props)
  const person = getPerson(state, {id})
  const goToDetails = () => props.navigation.navigate('MemberDetails', {id})
  const goToEdit = () => props.navigation.navigate('MemberDetails', {id, edit: true})
  const currentUser = getMe(state, props)
  const isMe = Number(currentUser.id) === Number(id)

  return {
    id,
    person,
    currentUser,
    goToDetails,
    goToEdit,
    isMe
  }
}

export function mapDispatchToProps (dispatch, props) {
  return {
    fetchPerson: id => dispatch(fetchPerson(id)),
    goToCommunity: makeGoToCommunity(dispatch, props.navigation)
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
