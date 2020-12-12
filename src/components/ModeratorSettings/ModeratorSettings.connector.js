import { connect } from 'react-redux'
import getCommunity from '../../store/selectors/getCommunity'
import getCurrentCommunityId from '../../store/selectors/getCurrentCommunityId'
import getMe from '../../store/selectors/getMe'

import {
  fetchModeratorSuggestions,
  clearModeratorSuggestions,
  getModerators,
  addModerator,
  removeModerator,
  fetchModerators
} from './ModeratorSettings.store'
import getPerson from '../../store/selectors/getPerson'
import { includes } from 'lodash/fp'

export function mapStateToProps (state, props) {
  const communityId = getCurrentCommunityId(state, props)
  const community = getCommunity(state, { id: communityId })
  const moderators = getModerators(state, { communityId })
  const moderatorIds = moderators.map(m => m.id)
  const moderatorSuggestions = state.ModeratorSettings
    .filter(personId => !includes(personId, moderatorIds))
    .map(personId => getPerson(state, { personId }))
  const currentUser = getMe(state, props)

  return {
    currentUser,
    community,
    moderators,
    moderatorSuggestions
  }
}

export function mapDispatchToProps (dispatch, { navigation }) {
  return {
    addModeratorMaker: (id, communityId) => dispatch(addModerator(id, communityId)),
    removeModeratorMaker: (id, isRemoveFromCommunity, communityId) => dispatch(removeModerator(id, communityId, isRemoveFromCommunity)),
    fetchModeratorsMaker: communitySlug => () => dispatch(fetchModerators(communitySlug)),
    showMember: id => navigation.navigate('MemberProfile', { id }),
    fetchModeratorSuggestionsMaker: (communityId, autocomplete) => dispatch(fetchModeratorSuggestions(communityId, autocomplete)),
    clearModeratorSuggestions: () => dispatch(clearModeratorSuggestions())
  }
}

export const mergeProps = (stateProps, dispatchProps, ownProps) => {
  const communitySlug = stateProps.community && stateProps.community.slug
  const communityId = stateProps.community && stateProps.community.id

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
    addModerator: (id) => addModeratorMaker(id, communityId),
    removeModerator: (id, isRemoveFromCommunity) => removeModeratorMaker(id, isRemoveFromCommunity, communityId),
    fetchModeratorSuggestions: (autocomplete) => fetchModeratorSuggestionsMaker(communityId, autocomplete),
    fetchModerators: communitySlug ? fetchModeratorsMaker(communitySlug) : () => {}
  }
}

export default connect(mapStateToProps, mapDispatchToProps, mergeProps)
