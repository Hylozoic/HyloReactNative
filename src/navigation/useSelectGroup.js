import { useEffect } from 'react'
import { useSelector, useDispatch } from 'react-redux'
import getRouteParam from 'store/selectors/getRouteParam'
import getCurrentGroupId from 'store/selectors/getCurrentGroupId'
import getGroup from 'store/selectors/getGroup'
import selectGroup from 'store/actions/selectGroup'
import { useRoute } from '@react-navigation/core'

// NOTE: This forces selection of the group provided in a deeplink to the group feed
// Generalize skipping this if in any modal?
export default function useGroupSelect () {
  const dispatch = useDispatch()
  const route = useRoute()
  const groupSlugFromLink = getRouteParam('groupSlugFromLink', route)
  const groupIdFromRoute = getRouteParam('groupId', route)
  const currentGroupId = useSelector(getCurrentGroupId)
  const groupId = groupIdFromRoute || currentGroupId
  const getGroupParams = groupSlugFromLink
    ? { slug: groupSlugFromLink }
    : { id: groupId }
  const group = useSelector(state => getGroup(state, getGroupParams))

  useEffect(() => {
    if (groupSlugFromLink && group?.id){
      dispatch(selectGroup(group.id))
    }
  }, [groupSlugFromLink, groupId, dispatch])
}
