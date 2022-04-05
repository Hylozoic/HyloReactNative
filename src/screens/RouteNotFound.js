import React, { useEffect } from 'react'
import { useDispatch } from 'react-redux'
import { SET_RETURN_TO_PATH } from 'store/constants'
import getRouteParam from 'store/selectors/getRouteParam'

export default function RouteNotFound ({ navigation, route }) {
  const dispatch = useDispatch()
  const notFoundPathAndQuery = getRouteParam('notFoundPathAndQuery', route)

  useEffect(() => {
    dispatch({
      type: SET_RETURN_TO_PATH,
      payload: notFoundPathAndQuery
    })
    navigation.goBack()
  })

  return null
}
