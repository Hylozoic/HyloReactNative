import { useEffect } from 'react'
import { useDispatch } from 'react-redux'
import selectGroup from 'store/actions/selectGroup'
import { useRoute } from '@react-navigation/core'
import useGetGroupFromParamsOrSelected from 'hooks/useGetGroupFromParamsOrSelected'

// NOTE: This forces selection of the group provided in a deeplink to the group feed
// Generalize skipping this if in any modal?
export default function useGroupSelect () {
  const dispatch = useDispatch()
  const route = useRoute()
  const routeParams = route.params
  const groupId = useGetGroupFromParamsOrSelected(routeParams)?.id

  useEffect(() => {
    dispatch(selectGroup(groupId))
  }, [groupId, dispatch])
}

