import { connect } from 'react-redux'
import { get } from 'lodash/fp'
import { getPerson, fetchPerson } from './MemberProfile.store'
import changeCommunity from '../../store/actions/changeCommunity'

export function mapStateToProps (state, props) {
  const id = get('navigation.state.params.id', props)
  const person = getPerson(state, {id})
  const goToDetails = () => props.navigation.navigate('MemberDetails', {id})
  const goToCommunity = id => props.navigation.navigate('Feed', {communityId: id})
  return {
    id,
    person,
    goToDetails,
    goToCommunity
  }
}

export function mapDispatchToProps (dispatch, props) {
  const goToCommunity = id => props.navigation.navigate('Feed', {communityId: id})
  return {
    fetchPerson: id => dispatch(fetchPerson(id)),
    goToCommunity: id => {
      dispatch(changeCommunity(id))
      goToCommunity(id)
    }
  }
}

export function mergeProps (stateProps, dispatchProps, ownProps) {
  const fetchPerson = () => dispatchProps.fetchPerson(stateProps.id)
  return {
    ...stateProps,
    ...dispatchProps,
    ...ownProps,
    fetchPerson
  }
}

export default connect(mapStateToProps, mapDispatchToProps, mergeProps)
