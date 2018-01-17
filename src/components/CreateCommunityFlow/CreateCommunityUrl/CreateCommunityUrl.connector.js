import { connect } from 'react-redux'
import { fetchCommunityExists } from '../actions'

export function mapStateToProps (state, props) {
  const urlExists = state.CreateCommunityFlow.urlExists
  return {
    urlExists
  }
}
export const mapDispatchToProps = {
  fetchCommunityExists
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
