import 'react-native'
import React from 'react'
import ReactShallowRenderer from 'react-test-renderer/shallow'
import ReactTestRenderer from 'react-test-renderer'
import SignupFlow4, { SkillCloud, SkillPill } from './SignupFlow4'

jest.mock('../../KeyboardFriendlyView', () => 'KeyboardFriendlyView')

describe('SignupFlow4', () => {
  it('matches last snapshot', () => {
    const renderer = new ReactShallowRenderer()
    const props = {
      saveAndNext: () => {},
      skill: 'Pop',
      setSkill: () => {},
      userSkills: ['Snap', 'Crackle'],
      remainingSkills: ['One', 'Two'],
      addSKill: () => {},
      removeSkill: () => {}
    }

    renderer.render(<SignupFlow4 {...props} />)
    const actual = renderer.getRenderOutput()

    expect(actual).toMatchSnapshot()
  })

  it('calls loadSkills on mount', () => {
    const props = {
      loadSkills: jest.fn(),
      skill: 'Pop',
      userSkills: ['Snap', 'Crackle'],
      remainingSkills: ['One', 'Two']
    }
    ReactTestRenderer.create(<SignupFlow4 {...props} />)
    expect(props.loadSkills).toHaveBeenCalled()
  })

  it('has navigationOptions', () =>
    expect(SignupFlow4.navigationOptions()).toMatchSnapshot())
})

describe('SkillCloud', () => {
  it('matches last snapshot', () => {
    const renderer = new ReactShallowRenderer()
    const props = {
      skills: ['Snap', 'Crackle'],
      onPress: () => {},
      style: {color: 'red'}
    }

    renderer.render(<SkillCloud {...props} />)
    const actual = renderer.getRenderOutput()

    expect(actual).toMatchSnapshot()
  })
})

describe('SkillPill', () => {
  it('matches last snapshot', () => {
    const renderer = new ReactShallowRenderer()
    const props = {
      skill: 'Snap',
      onPress: () => {}
    }

    renderer.render(<SkillPill {...props} />)
    const actual = renderer.getRenderOutput()

    expect(actual).toMatchSnapshot()
  })
})
