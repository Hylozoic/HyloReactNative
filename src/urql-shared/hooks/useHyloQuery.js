import { isString, isObject, isFunction } from 'lodash/fp'
import { useState, useEffect, useCallback } from 'react'
import { useDispatch } from 'react-redux'
import useDeepCompareMemoize from './useDeepCompareMemoize'
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

export default function useHyloQuery({ query, action, variables, meta }) {
  const dispatch = useDispatch()
  const [data, setData] = useState(null)
  const [fetching, setFetching] = useState(true)
  const [error, setError] = useState(null)

  // Memoize the dependencies using deep comparison
  const memoizedQuery = useDeepCompareMemoize(query)
  const memoizedAction = useDeepCompareMemoize(action)
  const memoizedVariables = useDeepCompareMemoize(variables)
  const memoizedMeta = useDeepCompareMemoize(meta)

  const executeQuery = useCallback(async () => {
    try {
      if (!memoizedQuery && !memoizedAction) {
        throw usageError
      }

      if (memoizedQuery && memoizedAction) {
        throw onlyQueryOrActionError
      }

      let response
      setFetching(true)

      // Action Creator (without params)
      if (isFunction(memoizedAction)) {
        response = await dispatch(memoizedAction())
      // Action
      } else if (isObject(memoizedAction) && Object.hasOwnProperty.call(memoizedAction, 'type')) {
        response = await dispatch(memoizedAction)
      // GraphQL query string
      } else if (isString(memoizedQuery)) {
        response = await dispatch(fetchGraphQLAction({
          query: memoizedQuery,
          variables: memoizedVariables || {},
          meta: memoizedMeta || {}
        }))
      // GraphQL operation object (compiled by gql tag)
      } else if (isObject(memoizedQuery) && Object.hasOwnProperty.call(memoizedQuery, 'definitions')) {
        response = await dispatch(fetchGraphQLAction({
          query: memoizedQuery,
          variables: memoizedVariables || {},
          meta: memoizedMeta || {}
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
  }, [dispatch, memoizedQuery, memoizedAction, memoizedVariables, memoizedMeta])

  useEffect(() => {
    executeQuery()
  }, [executeQuery])

  return [{ data, fetching, error }, executeQuery]
}
