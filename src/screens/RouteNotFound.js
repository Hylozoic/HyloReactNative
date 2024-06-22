import React, { useEffect } from 'react'
import { useDispatch } from 'react-redux'
import { SET_RETURN_TO_ON_AUTH_PATH } from 'store/constants'
import useRouteParam from 'hooks/useRouteParam'

export default function RouteNotFound ({ navigation }) {
  const dispatch = useDispatch()
  const notFoundPathAndQuery = useRouteParam('notFoundPathAndQuery')

  useEffect(() => {
    dispatch({
      type: SET_RETURN_TO_ON_AUTH_PATH,
      payload: notFoundPathAndQuery
    })
    navigation.goBack()
  })

  return null
}
