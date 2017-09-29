import { remainingSkills, mapStateToProps, mapDispatchToProps, mergeProps } from './SignupFlow4.connector'
import { MODULE_NAME } from '../SignupFlow.store'

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
  it('returns the right keys', () => {
    const state = {
      [MODULE_NAME]: {
        userSettings: {}
      }
    }
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
    const ownProps = {
      navigation: {
        navigate: jest.fn()
      }
    }
    const mergedProps = mergeProps(stateProps, dispatchProps, ownProps)
    expect(mergedProps).toMatchSnapshot()
    mergedProps.saveAndNext()
    expect(ownProps.navigation.navigate).toHaveBeenCalled()
    expect(ownProps.navigation.navigate.mock.calls)
    .toMatchSnapshot()
  })
})
