import reducer, {
  MODULE_NAME,
  ADD_SKILL_PENDING,
  REMOVE_SKILL_PENDING,
  SET_SKILL,
  SET_USER_SKILLS,
  setSkill,
  addSkill,
  removeSkill,
  setUserSkills,
  getMySkillsFromOrm,
  getUserSkills,
  getSkill
} from './SkillEditor.store'
import orm from 'store/models'

describe('reducer', () => {
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
      meta: { name: 'threeing' }
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
      meta: { name: 'twoing' }
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

describe('action generators', () => {
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
})

describe('getMySkillsFromOrm', () => {
  const session = orm.session(orm.getEmptyState())
  session.Me.create({
    skills: [
      session.Skill.create({ id: 1, name: 'one' }),
      session.Skill.create({ id: 2, name: 'two' })
    ]
  })
  session.Skill.create({ id: 3, name: 'three' })

  it('returns the skills on Me', () => {
    const state = {
      orm: session.state
    }
    expect(getMySkillsFromOrm(state).map(s => s.name))
      .toEqual(['one', 'two'])
  })
})

describe('pseudo selectors', () => {
  const state = {
    [MODULE_NAME]: {
      userSkills: ['snap', 'crackle', 'pop'],
      skill: 'swimming'
    }
  }

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
})
