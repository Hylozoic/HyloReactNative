import { useEffect } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { get } from 'lodash/fp'
import { isModalScreen } from 'navigation/linking/helpers'
import getGroup from 'store/selectors/getGroup'
import getLastViewedGroup from 'store/selectors/getLastViewedGroup'
import getCurrentGroup from 'store/selectors/getCurrentGroup'
import { useNavigation, useRoute } from '@react-navigation/native'
import selectGroupAction from 'store/actions/selectGroup'

export default function useSetCurrentGroup (loading = false) {
  const dispatch = useDispatch()
  const route = useRoute()
  const navigation = useNavigation()

  // const currentRoute = useNavigationState(state => state.routes[state.index])
  // console.log('!!! route in `useCurrentGroup`:', JSON.stringify(currentRoute, null, 2))
  // console.log('!!! route in `useCurrentGroup`:', route)

  const isModal = isModalScreen(route?.name) || isModalScreen(route?.params?.screen)
  const groupSlugRouteParam = get('groupSlug', route?.params)
  const groupFromGroupSlugRouteParam = useSelector(state => getGroup(state, { slug: groupSlugRouteParam }))
  const currentlySelectedGroup = useSelector(getCurrentGroup)
  const lastViewedGroup = useSelector(getLastViewedGroup)

  useEffect(() => {
    (async function () {
      if (!loading) {
        if (!isModal) {
          const groupToSelect = groupFromGroupSlugRouteParam || lastViewedGroup

          if (currentlySelectedGroup?.id !== groupToSelect?.id) {
            dispatch(selectGroupAction(groupToSelect.id))
            await navigation.navigate('Feed')
          }
        }
      }
    })()
  }, [
    loading,
    isModal,
    groupFromGroupSlugRouteParam,
    groupFromGroupSlugRouteParam?.groupSlug,
    groupFromGroupSlugRouteParam?.id,
    currentlySelectedGroup?.id,
    lastViewedGroup,
    lastViewedGroup?.id
  ])

  return null
}
