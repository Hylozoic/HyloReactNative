import selectCommunity from './selectCommunity'

export default function makeGoToCommunity (dispatch, navigation) {
  return id => {
    navigation.navigate('Tabs', { screen: 'Home', communityId: id })
    return dispatch(selectCommunity(id))
  }
}
