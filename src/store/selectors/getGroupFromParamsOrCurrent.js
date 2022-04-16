import { useSelector } from 'react-redux'
import { find } from 'lodash/fp'
import getCurrentGroupId from 'store/selectors/getCurrentGroupId'
import getGroup from 'store/selectors/getGroup'

export default function getGroupFromParamsOrCurrent (state, params) {
  const groupSlug = find('groupSlug', params)
  const groupIdFromRoute = find('groupId', params)
  const currentGroupId = useSelector(getCurrentGroupId)
  const groupId = groupIdFromRoute || currentGroupId
  const getGroupParams = groupSlug
    ? { slug: groupSlug }
    : { id: groupId }

  return getGroup(state, getGroupParams)
}
