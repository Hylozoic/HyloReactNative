import reducer, {
  MODULE_NAME,
  ADD_SKILL_PENDING,
  REMOVE_SKILL_PENDING,
  SIGNUP,
  UPDATE_LOCAL_USER_SETTINGS,
  SET_SKILL,
  SET_USER_SKILLS,
  getUserSkills
} from './SignupFlow.store'

describe('reducer', () => {
  describe('on SIGNUP', () => {
    const state = {
      skill: 'whateevs',
      errors: {
        email: 'No good email'
      }
    }
    const action = {
      type: SIGNUP
    }

    it('clears errors', () => {
      expect(reducer(state, action))
      .toEqual({
        skill: state.skill,
        errors: {}
      })
    })
  })

  describe('on SIGNUP with email error', () => {
    const state = {
      skill: 'whateevs',
      errors: {
        email: 'No good email'
      }
    }
    const action = {
      type: SIGNUP,
      error: true,
      payload: {
        response: {
          body: 'That email address is already in use'
        }
      }
    }

    it('sets the email error', () => {
      expect(reducer(state, action))
      .toEqual({
        skill: state.skill,
        errors: {
          email: 'That address is already in use. Try logging in instead.'
        }
      })
    })
  })

  describe('on UPDATE_LOCAL_USER_SETTINGS', () => {
    const state = {
      skill: 'whateevs',
      userSettings: {
        name: 'Jones',
        email: 'jones@home.com'
      }
    }
    const action = {
      type: UPDATE_LOCAL_USER_SETTINGS,
      payload: {
        email: 'zeus@olympus.com',
        location: 'home'
      }
    }

    it('updates those settings', () => {
      expect(reducer(state, action))
      .toEqual({
        skill: state.skill,
        userSettings: {
          name: 'Jones',
          email: 'zeus@olympus.com',
          location: 'home'
        }
      })
    })
  })

  describe('on SET_SKILL', () => {
    const state = {
      skill: 'whateevs',
      errors: {}
    }
    const action = {
      type: SET_SKILL,
      payload: 'yaml'
    }

    it('sets the skill', () => {
      expect(reducer(state, action))
      .toEqual({
        skill: 'yaml',
        errors: {}
      })
    })
  })

  describe('on ADD_SKILL_PENDING', () => {
    const state = {
      userSkills: ['oneing', 'twoing']
    }
    const action = {
      type: ADD_SKILL_PENDING,
      meta: {name: 'threeing'}
    }

    it('adds a skill', () => {
      expect(reducer(state, action))
      .toMatchSnapshot()
    })
  })

  describe('on REMOVE_SKILL_PENDING', () => {
    const state = {
      userSkills: ['oneing', 'twoing', 'threeing']
    }
    const action = {
      type: REMOVE_SKILL_PENDING,
      meta: {name: 'twoing'}
    }

    it('removes a skill', () => {
      expect(reducer(state, action))
      .toMatchSnapshot()
    })
  })

  describe('on SET_USER_SKILLS', () => {
    const state = {
      skill: 'hoola',
      userSkills: ['oneing', 'twoing', 'threeing']
    }
    const action = {
      type: SET_USER_SKILLS,
      payload: ['fouring', 'fiving']
    }

    it('sets the skills', () => {
      expect(reducer(state, action))
      .toEqual({
        skill: state.skill,
        userSkills: action.payload
      })
    })
  })
})

describe('getUserSkills', () => {
  const state = {
    [MODULE_NAME]: {
      userSkills: ['snap', 'crackle', 'pop']
    }
  }
  it('returns the userSkills', () => {
    expect(getUserSkills(state))
    .toMatchSnapshot()
  })
})
