import reducer, {
  MODULE_NAME,
  ADD_SKILL_PENDING,
  REMOVE_SKILL_PENDING,
  getUserSkills
} from './SignupFlow.store'

describe('reducer', () => {
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
