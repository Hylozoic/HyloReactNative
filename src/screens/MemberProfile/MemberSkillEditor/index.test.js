import 'react-native'
import React from 'react'
import ReactShallowRenderer from 'react-test-renderer/shallow'
import ReactTestRenderer from 'react-test-renderer'
import MemberSkillEditor from './index'

jest.mock('components/SkillEditor', () => 'SkillEditor')

it('matches the last snapshot', () => {
  const renderer = new ReactShallowRenderer()

  renderer.render(<MemberSkillEditor />)
  const actual = renderer.getRenderOutput()

  expect(actual).toMatchSnapshot()
})