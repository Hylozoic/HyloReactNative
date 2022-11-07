import { useNavigation } from '@react-navigation/native'
import { useSelector } from 'react-redux'
import confirmNavigate from 'util/confirmNavigate'
import { ALL_GROUP_ID, PUBLIC_GROUP_ID } from 'store/models/Group'
import { modalScreenName } from 'hooks/useIsModalScreen'
import getMemberships from 'store/selectors/getMemberships'
import getCurrentGroup from 'store/selectors/getCurrentGroup'

export default function useChangeToGroup () {
  const navigation = useNavigation()
  const myMemberships = useSelector(getMemberships)
  const currentGroup = useSelector(getCurrentGroup)

  return (groupSlug, confirm = true) => {
    if (!myMemberships) {
      throw new Error('Must provide current user memberships as 2nd parameter')
    }

    if (groupSlug === currentGroup?.slug) return

    const canViewGroup = myMemberships.find(m => m.group.slug === groupSlug) ||
      [PUBLIC_GROUP_ID, ALL_GROUP_ID].includes(groupSlug)

    if (canViewGroup) {
      const goToGroup = () => {
        navigation.navigate('Group Navigation', { groupSlug })
      }

      confirm
        ? confirmNavigate(goToGroup, {
          title: 'Changing Groups',
          confirmationMessage: 'Do you want to change context to this other group?'
        })
        : goToGroup()
    } else {
      navigation.navigate(modalScreenName('Group Explore'), { groupSlug })
    }
  }
}
