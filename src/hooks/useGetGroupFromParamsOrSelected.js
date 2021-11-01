import { useSelector } from 'react-redux'
import getCurrentGroupId from 'store/selectors/getCurrentGroupId'
import getGroup from 'store/selectors/getGroup'

export default function useGetGroupFromParamsOrSelected (routeParams) {
  const groupSlug = routeParams?.groupSlug
  const groupIdFromRoute = routeParams?.groupId
  const currentGroupId = useSelector(getCurrentGroupId)
  const groupId = groupIdFromRoute || currentGroupId
  const getGroupParams = groupSlug
    ? { slug: groupSlug }
    : { id: groupId }
  
  return useSelector(state => getGroup(state, getGroupParams))
}