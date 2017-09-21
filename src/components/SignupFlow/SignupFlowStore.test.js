import reducer, {
  MODULE_NAME,
  addUserSkill,
  removeUserSkill,
  getUserSkills
} from './SignupFlow.Store'

describe('reducer', () => {
  describe('on ADD_USER_SKILL', () => {
    const state = {
      userSkills: ['oneing', 'twoing']
    }
    const action = addUserSkill('threeing')

    it('adds a skill', () => {
      expect(reducer(state, action))
      .toMatchSnapshot()
    })
  })

  describe('on REMOVE_USER_SKILL', () => {
    const state = {
      userSkills: ['oneing', 'twoing', 'threeing']
    }
    const action = removeUserSkill('twoing')

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
