import { connect } from 'react-redux'
import getCurrentCommunityId from '../../store/selectors/getCurrentCommunityId'
import getCurrentCommunity from '../../store/selectors/getCurrentCommunity'
import { fetchCommunitySettings, updateCommunitySettings, UPDATE_COMMUNITY_SETTINGS } from './CommunitySettings.store'

export function mapStateToProps (state, props) {
  const communityId = getCurrentCommunityId(state, props)
  const community = getCurrentCommunity(state, props)
  const pendingSave = state.pending[UPDATE_COMMUNITY_SETTINGS]
  return {
    communityId,
    community,
    pendingSave
  }
}

export const mapDispatchToProps = {
  fetchCommunitySettings,
  updateCommunitySettings
}

export function mergeProps (stateProps, dispatchProps, ownProps) {
  const { communityId } = stateProps

  const fetchCommunitySettings = () =>
    dispatchProps.fetchCommunitySettings(communityId)

  const updateCommunitySettings = changes =>
    dispatchProps.updateCommunitySettings(communityId, changes)

  return {
    ...stateProps,
    ...dispatchProps,
    ...ownProps,
    fetchCommunitySettings,
    updateCommunitySettings
  }
}

export default connect(mapStateToProps, mapDispatchToProps, mergeProps)
