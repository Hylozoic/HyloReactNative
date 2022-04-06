import React, { useEffect } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import getRouteParam from 'store/selectors/getRouteParam'
import loginByToken from 'store/actions/loginByToken'
import logout from 'store/actions/logout'
import { getSignupComplete } from 'store/selectors/getAuthState'
import setReturnToPath from 'store/actions/setReturnToPath'
import LoadingScreen from 'screens/LoadingScreen'

export default function LoginByTokenHandler ({ navigation, route }) {
  const dispatch = useDispatch()
  const returnToURLFromLink = decodeURIComponent(getRouteParam('n', route))
  const loginToken = decodeURIComponent(getRouteParam('t', route) || getRouteParam('loginToken', route))
  const loginTokenUserId = getRouteParam('u', route) || getRouteParam('userId', route)
  const signupComplete = useSelector(getSignupComplete)

  useEffect(() => {
    if (!signupComplete) {
      navigation.navigate('Signup', { screen: 'SignupRegistration' })
    }
  }, [navigation, signupComplete])

  useEffect(() => {
    (async function () {
      if (loginToken && loginTokenUserId) {
        await dispatch(logout())
        await dispatch(loginByToken(loginTokenUserId, loginToken))
        if (returnToURLFromLink) {
          dispatch(setReturnToPath(returnToURLFromLink))
        }
      }
    })()
  }, [loginToken, loginTokenUserId, dispatch, returnToURLFromLink])

  return (
    <LoadingScreen />
  )
}
