import reducer, { MODULE_NAME, SET_TERM, setTerm, getTerm } from './Topics.store.js'

describe('reducer', () => {
  describe('on SET_TERM', () => {
    const action = {
      type: SET_TERM,
      payload: 'thenewterm'
    }
    it('sets the term field', () => {
      const state = {
        term: 'oldterm'
      }
      const newState = reducer(state, action)
      expect(newState.term).toEqual(action.payload)
    })
  })
})

describe('setTerm', () => {
  it('matches snapshot', () => {
    expect(setTerm('the payload')).toMatchSnapshot()
  })
})

describe('getTerm', () => {
  it('gets term from state', () => {
    const state = {
      [MODULE_NAME]: {
        term: 'the term'
      }
    }
    expect(getTerm(state)).toEqual(state[MODULE_NAME].term)
  })
})
