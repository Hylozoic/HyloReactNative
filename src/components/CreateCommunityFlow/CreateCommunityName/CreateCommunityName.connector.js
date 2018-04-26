import { connect } from 'react-redux'
import { saveCommunityName, getCommunityName } from '../CreateCommunityFlow.store'

export function mapStateToProps (state, props) {
  const communityName = getCommunityName(state)
  return {
    communityName
  }
}

export const mapDispatchToProps = {
  saveCommunityName
}

export function mergeProps (stateProps, dispatchProps, ownProps) {
  const { navigation } = ownProps
  return {
    ...stateProps,
    ...dispatchProps,
    ...ownProps,
    goToCreateCommunityUrl: () => {
      navigation.navigate({routeName: 'CreateCommunityUrl', key: 'CreateCommunityUrl'})
    },
    navigation
  }
}

export default connect(mapStateToProps, mapDispatchToProps, mergeProps)
