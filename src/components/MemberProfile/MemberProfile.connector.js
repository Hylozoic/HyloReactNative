import { connect } from 'react-redux'
import { get } from 'lodash/fp'
import { getPerson, fetchPerson } from './MemberProfile.store'
import changeCommunity from '../../store/actions/changeCommunity'
import makeGoToCommunity from '../../store/actions/makeGoToCommunity'
import getMe from '../../store/selectors/getMe'

export function mapStateToProps (state, props) {
  const id = get('navigation.state.params.id', props)
  const person = getPerson(state, {id})
  const goToDetails = () => props.navigation.navigate('MemberDetails', {id})

  return {
    id,
    person,
    currentUser: getMe(state, props),
    goToDetails
  }
}

export function mapDispatchToProps (dispatch, props) {
  return {
    fetchPerson: id => dispatch(fetchPerson(id)),
    goToCommunity: makeGoToCommunity(dispatch, props.navigation)
  }
}

export function mergeProps (stateProps, dispatchProps, ownProps) {
  const { id, currentUser } = stateProps

  const fetchPerson = () => dispatchProps.fetchPerson(id)

  const canFlag = currentUser && id && currentUser.id !== id

  return {
    ...stateProps,
    ...dispatchProps,
    ...ownProps,
    canFlag,
    fetchPerson
  }
}

export default connect(mapStateToProps, mapDispatchToProps, mergeProps)
