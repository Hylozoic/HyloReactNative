import { connect } from 'react-redux'
import { get } from 'lodash/fp'
import { getPerson, fetchPerson } from './MemberProfile.store'

export function mapStateToProps (state, props) {
  const id = get('navigation.state.params.id', props)
  const person = getPerson(state, {id})
  const showDetails = () => props.navigation.navigate('MemberDetails', {id})
  return {
    id,
    person,
    showDetails
  }
}

export const mapDispatchToProps = {
  fetchPerson
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
