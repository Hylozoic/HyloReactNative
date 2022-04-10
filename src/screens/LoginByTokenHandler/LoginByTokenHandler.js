import React, { useCallback } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import loginByToken from 'store/actions/loginByToken'
import loginByJWT from 'store/actions/loginByJWT'
import { getAuthorized } from 'store/selectors/getAuthState'
import checkLogin from 'store/actions/checkLogin'
import { navigateToLinkingPathInApp } from 'navigation/linking'
import { useFocusEffect, useRoute } from '@react-navigation/native'

export default function LoginByTokenHandler () {
  const route = useRoute()
  const dispatch = useDispatch()
  const returnToURLFromLink = decodeURIComponent(route?.params?.n)
  const jwt = decodeURIComponent(route?.params?.token)
  const loginToken = decodeURIComponent(route?.params?.t || route?.params?.loginToken)
  const userID = route?.params?.u || route?.params?.userId
  const isAuthorized = useSelector(getAuthorized)

  useFocusEffect(
    useCallback(() => {
      (async function () {
        try {
          if (!isAuthorized && userID && (jwt || loginToken)) {
            if (jwt) {
              const response = await dispatch(loginByJWT(jwt))

              if (response?.error) {
                navigateToLinkingPathInApp('/login?bannerError=invalid-link')
                return null
              }

              await dispatch(checkLogin())
            } else if (loginToken) {
              await dispatch(loginByToken(userID, loginToken))
            }
          }

          navigateToLinkingPathInApp(returnToURLFromLink || '/')
        } catch (e) {
          navigateToLinkingPathInApp('/login?bannerError=invalid-link')
        }
      })()
    }, [isAuthorized, jwt, loginToken, userID, returnToURLFromLink])
  )

  return null
}
