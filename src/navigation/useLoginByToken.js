import React, { useEffect } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import getRouteParam from 'store/selectors/getRouteParam'
import loginByToken from 'store/actions/loginByToken'
import logout from 'store/actions/logout'
import setReturnToPath from 'store/actions/setReturnToPath'
import { useRoute } from '@react-navigation/core'

// NOTE: This forces selection of the group provided in a deeplink to the group feed
// Generalize skipping this if in any modal?
export default function useGroupSelect () {
  const dispatch = useDispatch()
  const route = useRoute()
  const loginToken = decodeURIComponent(getRouteParam('t', route) || getRouteParam('loginToken', route))
  const loginTokenUserId = getRouteParam('u', route) || getRouteParam('userId', route)
  const returnToURLFromLink = decodeURIComponent(getRouteParam('n', route))

  useEffect(() => {
    const asyncFunc = async () => {
      if (loginToken && loginTokenUserId) {
        await logout()
        await dispatch(loginByToken(loginTokenUserId, loginToken))
      }
    }
    asyncFunc()
  }, [loginToken])


  useEffect(() => {
    if (returnToURLFromLink) {
      dispatch(setReturnToPath(returnToURLFromLink))
    }
  }, [returnToURLFromLink])
}

// // Move to RootView
// import { useSelector } from 'react-redux'
// import getSignupInProgress from 'store/selectors/getSignupInProgress'
// 
// const signupInProgress = useSelector(getSignupInProgress)
// useEffect(() => {
//   if (signupInProgress) {
//     navigation.navigate('Signup', { screen: 'SignupFlow1' })
//   }
// }, [])
