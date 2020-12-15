import { connect } from 'react-redux'
import {
  saveCommunityUrl,
  FETCH_URL_EXISTS,
  fetchCommunityExists,
  getCommunityUrlExists
} from '../CreateCommunityFlow.store'

export function mapStateToProps (state, props) {
  const urlExists = getCommunityUrlExists(state)
  const communityUrl = state.CreateCommunityFlow.communityUrl
  const fetchUrlPending = state.pending[FETCH_URL_EXISTS]
  return {
    urlExists,
    communityUrl,
    fetchUrlPending
  }
}

export const mapDispatchToProps = {
  fetchCommunityExists,
  saveCommunityUrl
}

export function mergeProps (stateProps, dispatchProps, ownProps) {
  const { navigation } = ownProps
  return {
    ...stateProps,
    ...dispatchProps,
    ...ownProps,
    goToCreateCommunityReview: () => {
      navigation.navigate('CreateCommunityReview')
    }
  }
}

export default connect(mapStateToProps, mapDispatchToProps, mergeProps)
