import confirmNavigate from 'util/confirmNavigate'
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
    const goToCommunity = () => {
      navigation.navigate('Home', {
          screen: 'Home',
          // TODO: Add this when redux session.community/network/Id is deprecated
          // params: {
          //   networkId: null,
          //   communityId
          // }
      })
      dispatch(selectCommunity(communityId))
    }

    confirmNavigate(goToCommunity, {
      title: 'Changing Communities',
      confirmationMessage: 'Do you want to change context to this other community?'
    })
  }
}
