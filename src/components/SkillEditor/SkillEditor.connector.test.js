import { remainingSkills, mapStateToProps, mapDispatchToProps, mergeProps } from './SkillEditor.connector'
import { MODULE_NAME } from './SkillEditor.store'

describe('remainingSkills', () => {
  const defaultSkills = [
    'singing', 'slinging', 'dancing', 'dashing', 'daring'
  ]

  it('filters chosen skills', () => {
    const userSkills = ['singing', 'dancing']
    expect(remainingSkills('', userSkills, defaultSkills))
      .toEqual(['slinging', 'dashing', 'daring'])
  })

  it('filters chosen skills and prefix', () => {
    const skillFilter = ['da']
    const userSkills = ['singing', 'dancing']
    expect(remainingSkills(skillFilter, userSkills, defaultSkills))
      .toEqual(['dashing', 'daring'])
  })
})

describe('mapStateToProps', () => {
  const state = {
    [MODULE_NAME]: {}
  }
  it('returns the right keys', () => {
    expect(mapStateToProps(state, {})).toMatchSnapshot()
  })
})

describe('mapDispatchToProps', () => {
  it('maps the action generators', () => {
    expect(mapDispatchToProps).toMatchSnapshot()
  })
})

describe('mergeProps', () => {
  it('merges the props', () => {
    const stateProps = {
      storedSkills: ['a', 'b', 'c']
    }
    const dispatchProps = {
      setUserSkills: jest.fn()
    }
    const mergedProps = mergeProps(stateProps, dispatchProps, {})
    expect(mergedProps).toMatchSnapshot()
  })
})
