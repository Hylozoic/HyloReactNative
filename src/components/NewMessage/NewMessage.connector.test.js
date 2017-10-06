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
})
