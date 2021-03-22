import { connect } from 'react-redux'
import getGroup from 'store/selectors/getGroup'
import getCurrentGroupId from 'store/selectors/getCurrentGroupId'
import getMe from 'store/selectors/getMe'

import {
  fetchModeratorSuggestions,
  clearModeratorSuggestions,
  getModerators,
  addModerator,
  removeModerator,
  fetchModerators
} from './ModeratorSettings.store'
import getPerson from 'store/selectors/getPerson'
import { includes } from 'lodash/fp'

export function mapStateToProps (state, props) {
  const groupId = getCurrentGroupId(state, props)
  const group = getGroup(state, { id: groupId })
  const moderators = getModerators(state, { groupId })
  const moderatorIds = moderators.map(m => m.id)
  const moderatorSuggestions = state.ModeratorSettings
    .filter(personId => !includes(personId, moderatorIds))
    .map(personId => getPerson(state, { personId }))
  const currentUser = getMe(state, props)

  return {
    currentUser,
    group,
    moderators,
    moderatorSuggestions
  }
}

export function mapDispatchToProps (dispatch, { navigation }) {
  return {
    addModeratorMaker: (id, groupId) => dispatch(addModerator(id, groupId)),
    removeModeratorMaker: (id, isRemoveFromGroup, groupId) => dispatch(removeModerator(id, groupId, isRemoveFromGroup)),
    fetchModeratorsMaker: groupSlug => () => dispatch(fetchModerators(groupSlug)),
    showMember: id => navigation.navigate('Member', { id }),
    fetchModeratorSuggestionsMaker: (groupId, autocomplete) => dispatch(fetchModeratorSuggestions(groupId, autocomplete)),
    clearModeratorSuggestions: () => dispatch(clearModeratorSuggestions())
  }
}

export const mergeProps = (stateProps, dispatchProps, ownProps) => {
  const groupSlug = stateProps.group && stateProps.group.slug
  const groupId = stateProps.group && stateProps.group.id

  const {
    addModeratorMaker,
    removeModeratorMaker,
    fetchModeratorSuggestionsMaker,
    fetchModeratorsMaker
  } = dispatchProps

  return {
    ...stateProps,
    ...dispatchProps,
    ...ownProps,
    addModerator: (id) => addModeratorMaker(id, groupId),
    removeModerator: (id, isRemoveFromGroup) => removeModeratorMaker(id, isRemoveFromGroup, groupId),
    fetchModeratorSuggestions: (autocomplete) => fetchModeratorSuggestionsMaker(groupId, autocomplete),
    fetchModerators: groupSlug ? fetchModeratorsMaker(groupSlug) : () => {}
  }
}

export default connect(mapStateToProps, mapDispatchToProps, mergeProps)
