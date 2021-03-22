import confirmNavigate from 'util/confirmNavigate'
import { navigate } from 'navigation/RootNavigation'

export default function makeGoToGroup (confirm = true) {
  return groupId => {
    const goToGroup = () => {
      navigate('Feed', { groupId })

    }
    if (confirm) {
      confirmNavigate(goToGroup, {
        title: 'Changing Groups',
        confirmationMessage: 'Do you want to change context to this other group?'
      })
     } else  {
      goToGroup()
     }
  }
}
