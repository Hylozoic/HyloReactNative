import React, { useEffect } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import getRouteParam from 'store/selectors/getRouteParam'
import loginByToken from 'store/actions/loginByToken'
import logout from 'store/actions/logout'
import getSignupInProgress from 'store/selectors/getSignupInProgress'
import setReturnToPath from 'store/actions/setReturnToPath'
import LoadingScreen from 'screens/LoadingScreen'

export default function LoginByTokenHandler ({ navigation, route }) {
  const dispatch = useDispatch()
  const returnToURLFromLink = decodeURIComponent(getRouteParam('n', route))
  const loginToken = decodeURIComponent(getRouteParam('t', route) || getRouteParam('loginToken', route))
  const loginTokenUserId = getRouteParam('u', route) || getRouteParam('userId', route)
  const signupInProgress = useSelector(getSignupInProgress)

  useEffect(() => {
    if (signupInProgress) {
      navigation.navigate('Signup', { screen: 'SignupFlow1' })
    }
  }, [])

  useEffect(() => {
    const asyncFunc = async () => {
      if (loginToken && loginTokenUserId) {
        await logout()
        await dispatch(loginByToken(loginTokenUserId, loginToken))
        if (returnToURLFromLink) {
          dispatch(setReturnToPath(returnToURLFromLink))
        }
      }
    }
    asyncFunc()
  }, [loginToken])

  return (
    <LoadingScreen />
  )
}
