import { connect } from 'react-redux'
import selectCommunity from '../../../store/actions/selectCommunity'
import { createCommunity, clearNameAndUrlFromStore } from '../CreateCommunityFlow.store'
import { ALL_COMMUNITIES_ID } from '../../../store/models/Community'

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
      if (community.id === ALL_COMMUNITIES_ID &&
        ownProps.screenProps.currentTabName !== 'Home') {
        navigation.navigate('Home')
      } else {
        navigation.navigate('DrawerClose')
      }
      const { id } = community
      dispatchProps.selectCommunity(id)
    }
  }
}

export default connect(mapStateToProps, mapDispatchToProps, mergeProps)
