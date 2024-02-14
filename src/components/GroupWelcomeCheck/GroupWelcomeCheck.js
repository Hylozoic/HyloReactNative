import React from 'react'
import { useSelector } from 'react-redux'
import { ALL_GROUP, MY_CONTEXT_GROUP, PUBLIC_GROUP } from 'store/models/Group'
import presentGroup from 'store/presenters/presentGroup'
import getMyMemberships from 'store/selectors/getMyMemberships'
import getGroup from 'store/selectors/getGroup'
import { useNavigation } from '@react-navigation/native'

export default function GroupWelcomeCheck ({ groupId }) {
  if (groupId === ALL_GROUP.id || groupId === PUBLIC_GROUP.id || groupId === MY_CONTEXT_GROUP.id) {
    return null
  }
  const currentGroup = useSelector(state => getGroup(state, { id: groupId }))
  const navigation = useNavigation()
  const currentMemberships = useSelector(state => getMyMemberships(state))
  const currentMembership = currentMemberships.find(m => m.group.id === groupId)
  const group = presentGroup(currentGroup)
  const { agreements } = group
  const { agreementsAcceptedAt, joinQuestionsAnsweredAt, showJoinForm } = currentMembership?.settings || {}

  const numAgreements = agreements?.length || 0

  const agreementsChanged = numAgreements > 0 &&
  (!agreementsAcceptedAt || agreementsAcceptedAt < currentGroup.settings.agreementsLastUpdatedAt)

  // This component is being gutted and replaced with a different flow. It is still useful to as a navigation redirect

  if (showJoinForm || agreementsChanged || !joinQuestionsAnsweredAt) {
    navigation.navigate('Group Welcome', { groupId })
  }

  return null
}
