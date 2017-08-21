import changeCommunity from './changeCommunity'

export default function makeGoToCommunity (dispatch, navigation) {
  return id => {
    navigation.navigate('Feed', {communityId: id})
    return dispatch(changeCommunity(id))
  }
}
