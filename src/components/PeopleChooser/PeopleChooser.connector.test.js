import { mapStateToProps, mapDispatchToProps, mergeProps } from './PeopleChooser.connector'
import { MODULE_NAME, defaultState, FETCH_SUGGESTIONS, FETCH_CONTACTS, FETCH_RECENT_CONTACTS } from './PeopleChooser.store.js'

describe('mapStateToProps', () => {
  it('returns the right keys and gets the pending values', () => {
    const state = {
      pending: {
        [FETCH_SUGGESTIONS]: 'suggestions',
        [FETCH_CONTACTS]: 'contacts',
        [FETCH_RECENT_CONTACTS]: 'recent'
      },
      [MODULE_NAME]: defaultState,
      queryResults: {}
    }
    expect(mapStateToProps(state, {}))
    .toMatchSnapshot()
  })
})

describe('mapDispatchToProps', () => {
  it('matches the last snapshot', () => {
    expect(mapDispatchToProps(() => {}, {}))
    .toMatchSnapshot()
  })
})

describe('mergeProps', () => {
  const defaultStateProps = {
    pending: {}
  }

  it('sets up fetchSuggestions', () => {
    const stateProps = {
      ...defaultStateProps,
      personInputText: 'not empty',
      suggestions: []
    }
    const dispatchProps = {
      fetchSuggestions: jest.fn()
    }
    const mergedProps = mergeProps(stateProps, dispatchProps, {})
    mergedProps.fetchSuggestions()
    expect(dispatchProps.fetchSuggestions).toHaveBeenCalled()
  })
})

