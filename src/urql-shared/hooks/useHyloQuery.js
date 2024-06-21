import { isString, isObject } from 'lodash/fp'
import { useState } from 'react'
import { useDispatch } from 'react-redux'
import fetchGraphQLAction from 'store/actions/fetchGraphQL'

const usageError = new Error(
  'Parameter is required, like: `graphqlAction(graphqlOperationOrReduxAction, optionalVariables)`'
)

export default function useHyloQuery() {
  const dispatch = useDispatch()
  const [data, setData] = useState(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState(null)

  const graphqlAction = async (graphqlOperationOrReduxAction, variables = {}) => {
    try {
      if (!graphqlOperationOrReduxAction) {
        throw usageError
      }

      setLoading(true)
      let response

      if (isString(graphqlOperationOrReduxAction)) {
        response = await dispatch(fetchGraphQLAction({
          query: graphqlOperationOrReduxAction,
          variables
        }))
      } else if (isObject(graphqlOperationOrReduxAction) && Object.hasOwnProperty.call(graphqlOperationOrReduxAction, 'definitions')) {
        response = await dispatch(fetchGraphQLAction({
          query: graphqlOperationOrReduxAction,
          variables
        }))
      } else if (isObject(graphqlOperationOrReduxAction) && Object.hasOwnProperty.call(graphqlOperationOrReduxAction, 'type')) {
        response = await dispatch(graphqlOperationOrReduxAction)
      }

      setData(response?.payload?.getData())
    } catch (e) {
      setError(e)
    } finally {
      setLoading(false)
    }
  }

  // Wrap graphqlAction function to return when graphqlOperationOrReduxAction is not provided
  const wrappedGraphqlAction = (graphqlOperationOrReduxAction, variables) => {
    if (!graphqlOperationOrReduxAction) {
      return graphqlAction
    } else {
      graphqlAction(graphqlOperationOrReduxAction, variables)
      return { data, loading, error }
    }
  }

  return wrappedGraphqlAction
}
