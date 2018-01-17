import { connect } from 'react-redux'
import { fetchCommunityExists } from '../actions'
import { saveCommunityUrl } from '../CreateCommunityFlow.store'

export function mapStateToProps (state, props) {
  const urlExists = state.CreateCommunityFlow.urlExists
  const communityUrl = state.CreateCommunityFlow.communityUrl
  return {
    urlExists,
    communityUrl
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
