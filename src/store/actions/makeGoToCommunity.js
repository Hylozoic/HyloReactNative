import selectCommunity from './selectCommunity'

export default function makeGoToCommunity (dispatch, navigation) {
  return id => {
    navigation.navigate({routeName: 'Feed', params: {communityId: id}, key: 'Feed'})
    return dispatch(selectCommunity(id))
  }
}
