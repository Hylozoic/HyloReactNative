import { useEffect } from 'react'
import { Linking } from 'react-native'
import { useOpenURL } from 'hooks/useOpenURL'
import { useDispatch, useSelector } from 'react-redux'
import { INITIAL_URL_HANDLED } from 'store/constants'

export default function useNavigateToInitialURL (loading, wait = 0) {
  const dispatch = useDispatch()
  const openURL = useOpenURL()
  const initialURLHandled = useSelector(state => state.session.initialURLHandled)

  useEffect(() => {
    if (!loading && !initialURLHandled) {
      (async function () {
        const initialURL = await Linking.getInitialURL()

        if (initialURL) {
          setTimeout(() => {
            dispatch({ type: INITIAL_URL_HANDLED, payload: true })
            openURL(initialURL)
          }, wait)
        } else {
          dispatch({ type: INITIAL_URL_HANDLED, payload: true })
        }
      })()
    }
  }, [loading])

  return null
}
