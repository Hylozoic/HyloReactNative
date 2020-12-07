import selectCommunity from './selectCommunity'

export default function makeGoToCommunity (dispatch, navigation) {
  return id => {
    navigation.navigate('Feed', { communityId: id })
    return dispatch(selectCommunity(id))
  }
}
