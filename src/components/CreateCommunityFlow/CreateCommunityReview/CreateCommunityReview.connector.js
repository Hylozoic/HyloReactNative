import { connect } from 'react-redux'

export function mapStateToProps (state, props) {
  const { communityName, communityUrl } = state.CreateCommunityFlow
  return {
    communityName,
    communityUrl
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

export default connect(mapStateToProps, null, mergeProps)
