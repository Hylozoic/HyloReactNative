import { mapStateToProps, mapDispatchToProps, mergeProps } from './NewMessage.connector'
import { MODULE_NAME, initialState, FETCH_SUGGESTIONS, FETCH_CONTACTS, FETCH_RECENT_CONTACTS } from './NewMessage.store.js'

describe('mapStateToProps', () => {
  it('returns the right keys and gets the pending values', () => {
    const state = {
      pending: {
        [FETCH_SUGGESTIONS]: 'suggestions',
        [FETCH_CONTACTS]: 'contacts',
        [FETCH_RECENT_CONTACTS]: 'recent'
      },
      [MODULE_NAME]: initialState,
      queryResults: {}
    }
    expect(mapStateToProps(state, {}))
      .toMatchSnapshot()
  })
})

describe('mapDispatchToProps', () => {
  it('matches the last snapshot', () => {
    expect(mapDispatchToProps)
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

  it('sets up the createMessage function', () => {
    const id = 122
    const findOrCreateThreadResp = {
      payload: {
        data: {
          findOrCreateThread: {
            id
          }
        }
      }
    }
    const stateProps = {
      ...defaultStateProps,
      message: 'not empty'
    }
    const dispatchProps = {
      findOrCreateThread: jest.fn(() => Promise.resolve(findOrCreateThreadResp)),
      createMessage: jest.fn(() => Promise.resolve({}))
    }
    const ownProps = {
      navigation: {
        navigate: jest.fn()
      }
    }
    const mergedProps = mergeProps(stateProps, dispatchProps, ownProps)
    return mergedProps.createMessage('hello')
      .then(() => {
        expect(dispatchProps.createMessage).toHaveBeenCalledWith(122, 'hello', true)
        expect(ownProps.navigation.navigate).toHaveBeenCalledWith('Thread', { id })
      })
  })
})
