import 'react-native'
import React from 'react'
import ReactShallowRenderer from 'react-test-renderer/shallow'
import SignupFlow4 from './SignupFlow4'

jest.mock('navigation/KeyboardFriendlyView', () => 'KeyboardFriendlyView')

describe('SignupFlow4', () => {
  it('matches last snapshot', () => {
    const renderer = new ReactShallowRenderer()
    const props = {
      saveAndNext: () => {},
      skill: 'Pop',
      setSkill: () => {},
      userSkills: ['Snap', 'Crackle'],
      remainingSkills: ['One', 'Two'],
      addSkill: () => {},
      removeSkill: () => {}
    }

    renderer.render(<SignupFlow4 {...props} />)
    const actual = renderer.getRenderOutput()

    expect(actual).toMatchSnapshot()
  })

  it('has navigationOptions', () =>
    expect(SignupFlow4.navigationOptions()).toMatchSnapshot())
})
