import selectCommunity from './selectCommunity'

export default function makeGoToCommunity (dispatch, navigation) {
  return communityId => {
    // TODO: Refresh navigation state on all the tabs back to root
    //       note that once we get this far we're near not needing the selected community/network 
    //       state storage... maybe
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
                    communityId: id
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
