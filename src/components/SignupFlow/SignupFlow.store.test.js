import reducer, {
  MODULE_NAME,
  ADD_SKILL_PENDING,
  REMOVE_SKILL_PENDING,
  SIGNUP,
  UPDATE_LOCAL_USER_SETTINGS,
  SET_SKILL,
  SET_USER_SKILLS,
  SET_SIGNUP_STEP1_COMPLETE,
  signup,
  updateLocalUserSettings,
  updateUserSettings,
  setSkill,
  addSkill,
  removeSkill,
  setUserSkills,
  setSignupStep1Complete,
  getSkillsFromOrm,
  getUserSkills,
  getSkill,
  getUserSettings,
  getSignupErrors,
  getSignupStep1Complete
} from './SignupFlow.store'
import orm from 'store/models'

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

  describe('on SET_SIGNUP_STEP1_COMPLETE', () => {
    const state = {
      signupStep1Complete: false
    }
    const action = {
      type: SET_SIGNUP_STEP1_COMPLETE,
      payload: true
    }

    it('sets signupStep1Complete', () => {
      expect(reducer(state, action))
      .toEqual({
        signupStep1Complete: true
      })
    })
  })
})

describe('action generators', () => {
  describe('signup', () => {
    const params = {
      name: 'a', email: 'b', password: 'c'
    }
    it('matches snapshot', () => expect(signup(params)).toMatchSnapshot())
  })

  describe('updateLocalUserSettings', () => {
    const params = {
      name: 'a', email: 'b', password: 'c'
    }
    it('matches snapshot', () => expect(updateLocalUserSettings(params)).toMatchSnapshot())
  })

  describe('updateUserSettings', () => {
    const params = {
      name: 'a', email: 'b', password: 'c'
    }
    it('matches snapshot', () => expect(updateUserSettings(params)).toMatchSnapshot())
  })

  describe('setSkill', () => {
    it('matches snapshot', () => expect(setSkill('Singing')).toMatchSnapshot())
  })

  describe('addSkill', () => {
    it('matches snapshot', () => expect(addSkill('Singing')).toMatchSnapshot())
  })

  describe('removeSkill', () => {
    it('matches snapshot', () => expect(removeSkill('Singing')).toMatchSnapshot())
  })

  describe('setUserSkills', () => {
    const skills = ['one', 'two']
    it('matches snapshot', () => expect(setUserSkills(skills)).toMatchSnapshot())
  })

  describe('setSignupStep1Complete', () => {
    it('matches snapshot', () => expect(setSignupStep1Complete(true)).toMatchSnapshot())
  })
})

describe('getSkillsFromOrm', () => {
  const session = orm.session(orm.getEmptyState())
  session.Me.create({skills: [
    session.Skill.create({id: 1, name: 'one'}),
    session.Skill.create({id: 2, name: 'two'})
  ]})
  session.Skill.create({id: 3, name: 'three'})

  it('returns the skills on Me', () => {
    const state = {
      orm: session.state
    }
    expect(getSkillsFromOrm(state).map(s => s.name))
    .toEqual(['one', 'two'])
  })
})

describe('pseudo selectors', () => {
  const state = {
    [MODULE_NAME]: {
      userSkills: ['snap', 'crackle', 'pop'],
      userSettings: {
        name: 'joe'
      },
      skill: 'swimming',
      errors: {
        email: 'Bad email'
      },
      signupStep1Complete: true
    }
  }

  describe('getUserSettings', () => {
    it('returns the userSettings', () => {
      expect(getUserSettings(state))
      .toEqual(state[MODULE_NAME].userSettings)
    })
  })

  describe('getSkill', () => {
    it('returns the skill', () => {
      expect(getSkill(state))
      .toEqual(state[MODULE_NAME].skill)
    })
  })

  describe('getUserSkills', () => {
    it('returns the userSkills', () => {
      expect(getUserSkills(state))
      .toEqual(state[MODULE_NAME].userSkills)
    })
  })

  describe('getSignupErrors', () => {
    it('returns the errors', () => {
      expect(getSignupErrors(state))
      .toEqual(state[MODULE_NAME].errors)
    })
  })

  describe('getSignupStep1Complete', () => {
    it('returns the status', () => {
      expect(getSignupStep1Complete(state))
      .toEqual(state[MODULE_NAME].signupStep1Complete)
    })
  })
})
