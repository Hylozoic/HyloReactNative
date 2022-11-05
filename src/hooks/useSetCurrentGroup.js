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
  const isModal = isModalScreen(route?.name) || isModalScreen(route?.params?.screen)
  const groupSlugRouteParam = get('groupSlug', route?.params)
  const groupFromRouteParam = useSelector(state => getGroup(state, { slug: groupSlugRouteParam }))
  const currentlySelectedGroup = useSelector(getCurrentGroup)
  const lastViewedGroup = useSelector(getLastViewedGroup)

  useEffect(() => {
    (async function () {
      if (!loading) {
        if (!isModal) {
          if (
            groupFromRouteParam &&
            (currentlySelectedGroup?.slug !== groupFromRouteParam?.slug)
          ) {
            dispatch(selectGroupAction(groupFromRouteParam.id))
          } else {
            dispatch(selectGroupAction(lastViewedGroup.id))
          }
        }
      }
    })()
  }, [
    loading,
    isModal,
    groupFromRouteParam?.id
  ])

  return null
}
