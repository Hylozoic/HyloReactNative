import { mapStateToProps, mapDispatchToProps, mergeProps } from './NewMessage.connector'
import { MODULE_NAME, defaultState, FETCH_SUGGESTIONS, FETCH_CONTACTS, FETCH_RECENT_CONTACTS } from './NewMessage.store.js'

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
  const defautStateProps = {
    allContacts: [],
    pending: {}
  }

  it('sets up fetchSuggestions', () => {
    const stateProps = {
      ...defautStateProps,
      participantInputText: 'not empty',
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
      ...defautStateProps,
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
    return mergedProps.createMessage()
    .then(() => {
      expect(ownProps.navigation.navigate).toHaveBeenCalledWith('Thread', {id})
    })
  })

  it('sets up loadParticipantsFromParams', () => {
    const dispatchProps = {
      setParticipants: jest.fn()
    }
    const participants = [3, 1, 2]
    const ownProps = {
      navigation: {
        state: {params: {participants}}
      }
    }
    const mergedProps = mergeProps(defautStateProps, dispatchProps, ownProps)
    mergedProps.loadParticipantsFromParams()
    expect(dispatchProps.setParticipants).toHaveBeenCalledWith(participants)
  })

  it('sets fetchMoreContacts to no op when pending', () => {
    const stateProps = {
      ...defautStateProps,
      pending: {
        all: true
      }
    }
    const dispatchProps = {
      fetchContacts: jest.fn()
    }
    const mergedProps = mergeProps(stateProps, dispatchProps, {})
    mergedProps.fetchMoreContacts()
    expect(dispatchProps.fetchContacts).not.toHaveBeenCalled()
  })

  it('sets up fetchMoreContacts', () => {
    const stateProps = {
      ...defautStateProps,
      allContacts: [1, 2, 3, 4]
    }
    const dispatchProps = {
      fetchContacts: jest.fn()
    }
    const mergedProps = mergeProps(stateProps, dispatchProps, {})
    mergedProps.fetchMoreContacts()
    expect(dispatchProps.fetchContacts).toHaveBeenCalledWith(10, stateProps.allContacts.length)
  })
})
