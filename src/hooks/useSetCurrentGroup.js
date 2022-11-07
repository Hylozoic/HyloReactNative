import { useEffect } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { useNavigation, useRoute } from '@react-navigation/native'
import { get } from 'lodash/fp'
import getGroup from 'store/selectors/getGroup'
import getLastViewedGroup from 'store/selectors/getLastViewedGroup'
import getCurrentGroup from 'store/selectors/getCurrentGroup'
import setCurrentGroupId from 'store/actions/setCurrentGroupId'

export default function useSetCurrentGroup (loading = false) {
  const dispatch = useDispatch()
  const route = useRoute()
  const navigation = useNavigation()
  const groupSlugRouteParam = get('groupSlug', route?.params)
  const groupFromRouteParam = useSelector(state => getGroup(state, { slug: groupSlugRouteParam }))
  const currentGroup = useSelector(getCurrentGroup)
  const lastViewedGroup = useSelector(getLastViewedGroup)

  useEffect(() => {
    (async function () {
      if (
        groupFromRouteParam &&
        (currentGroup?.slug !== groupFromRouteParam?.slug)
      ) {
        await dispatch(setCurrentGroupId(groupFromRouteParam.id))
        navigation.navigate('Feed')
      } else if (currentGroup?.slug !== lastViewedGroup?.slug) {
        await dispatch(setCurrentGroupId(lastViewedGroup.id))
        navigation.navigate('Feed')
      }
    })()
  }, [
    loading,
    groupFromRouteParam?.id
  ])

  return null
}
