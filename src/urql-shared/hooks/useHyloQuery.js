import { isString, isObject, isFunction } from 'lodash/fp'
import { useState, useEffect, useCallback } from 'react'
import { useDispatch } from 'react-redux'
import fetchGraphQLAction from 'store/actions/fetchGraphQL'

const usageError = new Error(
  'A value for either "query" or "action" is required'
)

const onlyQueryOrActionError = new Error(
  'Only one of "query" or "action" can be provided'
)

const noDataError = new Error(
  'No data returned from the GraphQL query or action.'
)

export default function useHyloQuery ({ query, action, variables, meta }) {
  const dispatch = useDispatch()
  const [data, setData] = useState(null)
  const [fetching, setFetching] = useState(true)
  const [error, setError] = useState(null)

  const executeQuery = useCallback(async () => {
    try {
      if (!query && !action) {
        throw usageError
      }

      if (query && action) {
        throw onlyQueryOrActionError
      }

      let response
      setFetching(true)

      // Action Creator (without params)
      if (isFunction(action)) {
        response = await dispatch(action())
      // Action
      } else if (isObject(action) && Object.hasOwnProperty.call(action, 'type')) {
        response = await dispatch(action)
        console.log(action)
      // GraphQL query string
      } else if (isString(query)) {
        response = await dispatch(fetchGraphQLAction({
          query,
          variables: variables || {},
          meta: meta || {}
        }))
      // GraphQL operation object (compiled by gql tag)
      } else if (isObject(query) && Object.hasOwnProperty.call(query, 'definitions')) {
        response = await dispatch(fetchGraphQLAction({
          query,
          variables: variables || {},
          meta: meta || {}
        }))
      }

      if (response?.payload?.getData() === null) {
        throw noDataError
      }

      setData(response?.payload?.getData())
    } catch (e) {
      setError(e)
    } finally {
      setFetching(false)
    }
  }, [variables])

  useEffect(() => { executeQuery() }, [variables])

  return [{ data, fetching, error }, executeQuery]
}
