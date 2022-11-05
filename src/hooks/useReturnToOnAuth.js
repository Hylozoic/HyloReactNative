import { useEffect } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { isEmpty } from 'lodash/fp'
import { navigateToLinkingPath } from 'navigation/linking'
import setReturnToOnAuthPath from 'store/actions/setReturnToOnAuthPath'
import getReturnToOnAuthPath from 'store/selectors/getReturnToOnAuthPath'

export default function useReturnToOnAuth (loading = false) {
  const returnToOnAuthPath = useSelector(getReturnToOnAuthPath)
  const dispatch = useDispatch()

  useEffect(() => {
    (async function () {
      if (!loading) {
        if (!isEmpty(returnToOnAuthPath)) {
          dispatch(setReturnToOnAuthPath())
          navigateToLinkingPath(returnToOnAuthPath)
        }
      }
    })()
  }, [
    loading,
    returnToOnAuthPath
  ])

  return null
}
