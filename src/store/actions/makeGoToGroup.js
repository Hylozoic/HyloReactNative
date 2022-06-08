import confirmNavigate from 'util/confirmNavigate'
import { ALL_GROUP_ID, PUBLIC_GROUP_ID } from 'store/models/Group'
import { navigateToLinkingPath } from 'navigation/linking'
import { modalScreenName } from 'navigation/linking/helpers'

export default function makeGoToGroup ({ navigate }, dispatch, confirm = true) {
  return (groupSlug, myMemberships, currentGroupSlug) => {
    if (!myMemberships) {
      throw new Error('Must provide current user memberships as 2nd parameter')
    }

    if (groupSlug === currentGroupSlug) return

    const canViewGroup = myMemberships.find(m => m.group.slug === groupSlug) ||
      [PUBLIC_GROUP_ID, ALL_GROUP_ID].includes(groupSlug)

    if (canViewGroup) {
      const goToGroup = () => navigateToLinkingPath(`/groups/${groupSlug}`)
      confirm
        ? confirmNavigate(goToGroup, {
            title: 'Changing Groups',
            confirmationMessage: 'Do you want to change context to this other group?'
          })
        : goToGroup()
    } else {
      navigate(modalScreenName('Group Detail'), { groupSlug })
    }
  }
}
