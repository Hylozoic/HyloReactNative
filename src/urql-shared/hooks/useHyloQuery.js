import { isString, isObject, isFunction } from 'lodash/fp'
import { useState, useEffect, useCallback } from 'react'
import { useDispatch } from 'react-redux'
import fetchGraphQLAction from 'store/actions/fetchGraphQL'

const usageError = new Error(
  'Parameter is required, like: `executeQueryOrAction(graphqlQueryOrAction, optionalVariables)`'
)

const noDataError = new Error(
  'No data returned from the GraphQL query or action.'
)

export default function useHyloQuery (graphqlQueryOrAction, variables) {
  const dispatch = useDispatch()
  const [data, setData] = useState(null)
  const [fetching, setFetching] = useState(true)
  const [error, setError] = useState(null)

  const fetchData = async (action, vars) => {
    try {
      if (!action) {
        throw usageError
      }

      let response
      setFetching(true)

      if (isString(action)) {
        response = await dispatch(fetchGraphQLAction({
          query: action,
          vars
        }))
      } else if (isFunction(action)) {
        response = await dispatch(action(variables))
      } else if (isObject(action) && Object.hasOwnProperty.call(action, 'definitions')) {
        response = await dispatch(fetchGraphQLAction({
          query: action,
          vars
        }))
      } else if (isObject(action) && Object.hasOwnProperty.call(action, 'type')) {
        response = await dispatch(action)
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
  }

  const executeQueryOrAction = useCallback(() => {
    fetchData(graphqlQueryOrAction, variables)
  }, [graphqlQueryOrAction, variables])

  const executeQueryOrActionWithData = useCallback(() => {
    executeQueryOrAction()
    return [{ data, fetching, error }, executeQueryOrAction]
  }, [graphqlQueryOrAction, variables])

  useEffect(() => {
    if (graphqlQueryOrAction) {
      executeQueryOrAction()
    }
  }, [graphqlQueryOrAction, variables])

  if (!graphqlQueryOrAction) return executeQueryOrActionWithData

  return [{ data, fetching, error }, executeQueryOrAction]
}
