import { useSelector } from 'react-redux'
import getCurrentGroupId from 'store/selectors/getCurrentGroupId'
import getGroup from 'store/selectors/getGroup'

export default function getGroupFromParamsOrCurrent (state, params) {
  const groupSlug = params?.groupSlug
  const groupIdFromRoute = params?.groupId
  const currentGroupId = useSelector(getCurrentGroupId)
  const groupId = groupIdFromRoute || currentGroupId
  const getGroupParams = groupSlug
    ? { slug: groupSlug }
    : { id: groupId }

  return getGroup(state, getGroupParams)
}
