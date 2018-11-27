import { get } from 'lodash/fp'
import { createSelector } from 'reselect'

export const getQuerySearchTerms = createSelector(
  state => state.querySearchTerms,
  querySearchTerms => querySearchTerms
)

export const getQuerySearchTermForScope = createSelector(
  getQuerySearchTerms,
  (_, props) => {
    if (!props.scope) throw new Error('`scope` prop is required for a querySearchTerm selection')
    return props.scope
  },
  (querySearchTerms, scope) => {
    return get(scope, querySearchTerms)
  }
)

export default getQuerySearchTermForScope
