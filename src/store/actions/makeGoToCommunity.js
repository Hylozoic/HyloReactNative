import confirmNavigate from 'util/confirmNavigate'
import { navigate } from 'navigation/RootNavigation'

export default function makeGoToCommunity (dispatch, navigation, confirm = true) {
  return communityId => {
    const goToCommunity = () => {
      navigate('Feed', {
        networkId: null,
        communityId
      })

    }
    if (confirm) {
      confirmNavigate(goToCommunity, {
        title: 'Changing Communities',
        confirmationMessage: 'Do you want to change context to this other community?'
      })
     } else  {
      goToCommunity()
     }
  }
}
