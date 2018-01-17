import { connect } from 'react-redux'
import { saveCommunityName } from '../CreateCommunityFlow.store'

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
      navigation.navigate('CreateCommunityUrl')
    }
  }
}

export default connect(null, mapDispatchToProps, mergeProps)
