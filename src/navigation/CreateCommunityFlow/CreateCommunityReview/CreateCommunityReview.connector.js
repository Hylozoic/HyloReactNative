import { connect } from 'react-redux'
import selectCommunity from 'store/actions/selectCommunity'
import {
  createCommunity,
  clearNameAndUrlFromStore,
  CREATE_COMMUNITY,
  getCommunityName,
  getCommunityUrl
} from '../CreateCommunityFlow.store'

export function mapStateToProps (state, props) {
  const communityName = getCommunityName(state)
  const communityUrl = getCommunityUrl(state)
  const createCommunityPending = state.pending[CREATE_COMMUNITY]
  return {
    communityName,
    communityUrl,
    createCommunityPending
  }
}

export function mapDispatchToProps (dispatch, props) {
  return {
    createCommunity: (name, slug) => dispatch(createCommunity(name, slug)),
    clearNameAndUrlFromStore: () => dispatch(clearNameAndUrlFromStore()),
    selectCommunity: (id) => dispatch(selectCommunity(id))
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
    },
    goToCommunity: community => {
      navigation.closeDrawer()
      const { id } = community
      dispatchProps.selectCommunity(id)
    }
  }
}

export default connect(mapStateToProps, mapDispatchToProps, mergeProps)
