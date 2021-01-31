import { createSelector as ormCreateSelector } from 'redux-orm'
import orm from 'store/models'
import { validateTopicName } from 'hylo-utils/validators'

// FIXME this could return topics that are not in the current community
function topicsResults (session, autocomplete) {
  const searchTerm = autocomplete && autocomplete.toLowerCase()
  const results = session.Topic.all()
    .filter(({ name }) => name && name.toLowerCase().match(searchTerm))
    .orderBy('name')
    .toRefArray()
  return results
}

function topicsResultsWithNew (session, autocomplete) {
  const searchTerm = autocomplete && autocomplete.toLowerCase()
  const results = topicsResults(session, searchTerm)
  const validNewTopic = !results.find(t => t.name === searchTerm) &&
    !validateTopicName(searchTerm)
  return validNewTopic
    ? [{ id: searchTerm, name: searchTerm }, ...results]
    : results
}

export const getTopicsForAutocomplete = ormCreateSelector(
  orm,
  (_, { autocomplete }) => autocomplete,
  topicsResults
)

export const getTopicsForAutocompleteWithNew = ormCreateSelector(
  orm,
  (_, { autocomplete }) => autocomplete,
  topicsResultsWithNew
)

export default getTopicsForAutocompleteWithNew
