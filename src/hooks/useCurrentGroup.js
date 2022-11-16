import { useDispatch, useSelector } from 'react-redux'
import { ALL_GROUPS_CONTEXT_SLUG } from 'hylo-shared'
import getLastViewedGroup from 'store/selectors/getLastViewedGroup'
import getCurrentGroup from 'store/selectors/getCurrentGroup'
import setCurrentGroupSlug from 'store/actions/setCurrentGroupSlug'

export default function useCurrentGroup (loading = false) {
  const dispatch = useDispatch()
  const currentGroup = useSelector(getCurrentGroup)
  const lastViewedGroup = useSelector(getLastViewedGroup)

  const setCurrentGroup = async (groupSlugRouteParam, loading = false) => {
    if (!loading) {
      if (
        groupSlugRouteParam &&
        (currentGroup?.slug !== groupSlugRouteParam)
      ) {
        dispatch(setCurrentGroupSlug(groupSlugRouteParam))
      } else if (!currentGroup) {
        dispatch(setCurrentGroupSlug(lastViewedGroup?.slug || ALL_GROUPS_CONTEXT_SLUG))
      }
    }
  }

  return [currentGroup, setCurrentGroup]

  // useEffect(() => {
  //   (async function () {
  //     if (!loading) {
  //       if (
  //         groupFromRouteParam &&
  //         (currentGroup?.slug !== groupFromRouteParam?.slug)
  //       ) {
  //         await dispatch(setCurrentGroupSlug(groupFromRouteParam.id))
  //       } else if (!currentGroup) {
  //         await dispatch(setCurrentGroupSlug(lastViewedGroup?.id || ALL_GROUP_ID))
  //         await navigation.navigate('Home Tab', { screen: 'Feed', initial: false })
  //       }
  //     }
  //   })()
  // }, [
  //   loading,
  //   groupFromRouteParam?.id
  // ])

  // return null
}
