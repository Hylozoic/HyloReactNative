import reducer, { setParticipants, SET_PARTICIPANTS } from './NewMessage.store'

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
})

describe('setParticipants', () => {
  it('returns the action', () => {
    const participants = [4, 2, 3]
    const action = setParticipants(participants)
    expect(action.type).toEqual(SET_PARTICIPANTS)
    expect(action.payload).toEqual(participants)
  })
})
