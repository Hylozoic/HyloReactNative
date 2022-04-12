import React, { useCallback } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import loginByToken from 'store/actions/loginByToken'
import loginByJWT from 'store/actions/loginByJWT'
import { getAuthorized, getAuthStateLoading } from 'store/selectors/getAuthState'
import { navigateToLinkingPath } from 'navigation/linking'
import { useFocusEffect, useRoute } from '@react-navigation/native'

export default function LoginByTokenHandler () {
  const route = useRoute()
  const dispatch = useDispatch()
  const authStateLoading = useSelector(getAuthStateLoading)
  const isAuthorized = useSelector(getAuthorized)
  const returnToURLFromLink = decodeURIComponent(route?.params?.n)
  const jwt = decodeURIComponent(route?.params?.token)
  const loginToken = decodeURIComponent(route?.params?.t || route?.params?.loginToken)
  const userID = route?.params?.u || route?.params?.userId

  useFocusEffect(
    useCallback(() => {
      (async function () {
        if (authStateLoading) return null

        try {
          if (!isAuthorized && userID && (jwt || loginToken)) {
            if (jwt) {
              const response = await dispatch(loginByJWT(jwt))

              if (response?.error) {
                navigateToLinkingPath('/login?bannerError=invalid-link')
                return null
              }
            } else if (loginToken) {
              await dispatch(loginByToken(userID, loginToken))
            }
          }

          navigateToLinkingPath(returnToURLFromLink || '/')
        } catch (e) {
          navigateToLinkingPath('/login?bannerError=invalid-link')
        }
      })()
    }, [authStateLoading, isAuthorized, jwt, loginToken, userID, returnToURLFromLink])
  )

  return null
}
