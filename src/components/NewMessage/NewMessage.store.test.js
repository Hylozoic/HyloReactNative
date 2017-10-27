import reducer, {
   setParticipants, SET_PARTICIPANTS, REMOVE_PARTICIPANT, CREATE_MESSAGE
} from './NewMessage.store'

describe('reducer', () => {
  describe('on SET_PARTICIPANTS', () => {
    const participants = [4, 2, 3]
    const action = {
      type: SET_PARTICIPANTS,
      payload: participants
    }

    it('sets the participants', () => {
      const newState = reducer({}, action)
      expect(newState.participants).toEqual(participants)
    })
  })

  describe('on REMOVE_PARTICIPANT', () => {
    const action = {
      type: REMOVE_PARTICIPANT
    }
    const state = {
      otherKey: 'set'
    }
    it('does nothing with no payload', () => {
      const newState = reducer(state, action)
      expect(newState).toEqual(state)
    })
  })

  describe('on CREATE_MESSAGE', () => {
    const action = {
      type: CREATE_MESSAGE
    }
    const state = {
      otherKey: 'set',
      input: 'yo',
      participants: [1, 2, 3]
    }
    it('clears the message state', () => {
      const newState = reducer(state, action)
      expect(newState).toEqual({
        ...state,
        input: '',
        participants: []
      })
    })
  })
})

describe('setParticipants', () => {
  it('returns the action', () => {
    const participants = [4, 2, 3]
    const action = setParticipants(participants)
    expect(action.type).toEqual(SET_PARTICIPANTS)
    expect(action.payload).toEqual(participants)
  })
})
