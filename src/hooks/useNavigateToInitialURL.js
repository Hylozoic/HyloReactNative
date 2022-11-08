import { useEffect } from 'react'
import { Linking } from 'react-native'
import { openURL } from 'navigation/linking'
import { useDispatch, useSelector } from 'react-redux'
import { INITIAL_URL_HANDLED } from 'store/constants'

export default function useNavigateToInitialURL (loading, wait = 0) {
  const dispatch = useDispatch()
  const initialURLHandled = useSelector(state => state.session.initialURLHandled)

  useEffect(() => {
    if (!loading && !initialURLHandled) {
      (async function () {
        const initialURL = await Linking.getInitialURL()

        dispatch({ type: INITIAL_URL_HANDLED, payload: true })

        setTimeout(() => {
          if (initialURL) {
            openURL(initialURL)
          }
        }, wait)
      })()
    }
  }, [loading])
}
