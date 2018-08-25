import 'react-native'
import React from 'react'
import ReactShallowRenderer from 'react-test-renderer/shallow'
import ReactTestRenderer from 'react-test-renderer'
import MemberSkillEditor from './index'

jest.mock('../../SkillEditor', () => 'SkillEditor')

it('matches the last snapshot', () => {
  const renderer = new ReactShallowRenderer()

  renderer.render(<MemberSkillEditor />)
  const actual = renderer.getRenderOutput()

  expect(actual).toMatchSnapshot()
})

describe('goBack', () => {
  it('calls navigation.goBack', () => {
    const props = {
      navigation: {
        goBack: jest.fn()
      }
    }
    const instance = ReactTestRenderer.create(<MemberSkillEditor {...props} />).getInstance()
    instance.goBack()
    expect(props.navigation.goBack).toHaveBeenCalled()
  })
})
