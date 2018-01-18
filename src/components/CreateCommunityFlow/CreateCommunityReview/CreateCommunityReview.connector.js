import { connect } from 'react-redux'
import { createCommunity, clearNameAndUrlFromStore } from '../CreateCommunityFlow.store'

export function mapStateToProps (state, props) {
  const { communityName, communityUrl } = state.CreateCommunityFlow
  return {
    communityName,
    communityUrl
  }
}

export function mapDispatchToProps (dispatch, props) {
  return {
    createCommunity: (name, slug) => dispatch(createCommunity(name, slug)),
    clearNameAndUrlFromStore: () => dispatch(clearNameAndUrlFromStore())
  }
}

export function mergeProps (stateProps, dispatchProps, ownProps) {
  const { navigation } = ownProps
  return {
    ...stateProps,
    ...dispatchProps,
    ...ownProps,
    goToCreateCommunityName: () => {
      navigation.navigate('CreateCommunityName')
    },
    goToCreateCommunityUrl: () => {
      navigation.navigate('CreateCommunityUrl')
    }
  }
}

export default connect(mapStateToProps, mapDispatchToProps, mergeProps)
