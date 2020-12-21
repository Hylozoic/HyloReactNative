import selectCommunity from './selectCommunity'

export default function makeGoToCommunity (dispatch, navigation) {
  return communityId => {
    // TODO: Eliminate reset transition, or go back
    // to navigate() magic for less ugly
    navigation.reset({
      id: 0,
      routes: [
        {          
          name: 'Tabs',
          index: 0,
          routes: [
            {
              name: 'Home',
              index: 0,
              routes: [
                {
                  name: 'Feed',
                  params: {
                    networkId: null,
                    communityId
                  }
                }
              ]
            }
          ]
        }
      ]
    })
    // navigation.navigate('Feed', {
    //   networkId: null,
    //   communityId
    // })

    return dispatch(selectCommunity(communityId))
  }
}
