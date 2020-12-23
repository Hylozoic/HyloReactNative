import selectCommunity from './selectCommunity'

export default function makeGoToCommunity (dispatch, navigation) {
  return communityId => {
    // Note: This is a good opportunity for a reset,
    // but the screen transition is ugly so sticking
    // with simple nav for now.
    // navigation.reset({
    //   id: 0,
    //   routes: [
    //     {          
    //       name: 'Tabs',
    //       index: 0,
    //       routes: [
    //         {
    //           name: 'Home',
    //           index: 0,
    //           routes: [
    //             {
    //               name: 'Feed',
    //               params: {
    //                 networkId: null,
    //                 communityId
    //               }
    //             }
    //           ]
    //         }
    //       ]
    //     }
    //   ]
    // })
    navigation.navigate('Home', {
      networkId: null,
      communityId  
    })

    return dispatch(selectCommunity(communityId))
  }
}
