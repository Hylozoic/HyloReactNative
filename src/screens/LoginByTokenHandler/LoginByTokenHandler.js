import React, { useCallback } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import loginByToken from 'store/actions/loginByToken'
import loginByJWT from 'store/actions/loginByJWT'
import { getAuthorized } from 'store/selectors/getAuthState'
import { navigateToLinkingPath } from 'navigation/linking'
import { useFocusEffect, useRoute } from '@react-navigation/native'
import setReturnToOnAuthPath from 'store/actions/setReturnToOnAuthPath'
import checkLogin from 'store/actions/checkLogin'

export default function LoginByTokenHandler () {
  const route = useRoute()
  const dispatch = useDispatch()
  const isAuthorized = useSelector(getAuthorized)
  const returnToURLFromLink = decodeURIComponent(route?.params?.n)
  const jwt = decodeURIComponent(route?.params?.token)
  const loginToken = decodeURIComponent(route?.params?.t || route?.params?.loginToken)
  const userID = route?.params?.u || route?.params?.userId

  useFocusEffect(
    useCallback(() => {
      (async function () {
        try {
          if (isAuthorized) {
            navigateToLinkingPath(returnToURLFromLink || '/', true)
          } else {
            if (jwt) {
              const response = await dispatch(loginByJWT(jwt))

              if (response?.error) {
                navigateToLinkingPath('/login?bannerError=invalid-link', true)
              }
              dispatch(setReturnToOnAuthPath(returnToURLFromLink || '/'))
              await dispatch(checkLogin())
            } else if (loginToken && userID) {
              await dispatch(loginByToken(userID, loginToken))
              await dispatch(setReturnToOnAuthPath(returnToURLFromLink || '/'))
            } else {
              navigateToLinkingPath('/')
            }
          }
        } catch (e) {
          console.log('!!! error', e)
          navigateToLinkingPath('/login?bannerError=invalid-link', true)
        }
      })()
    }, [dispatch, isAuthorized, jwt, loginToken, userID, returnToURLFromLink])
  )

  return null
}
