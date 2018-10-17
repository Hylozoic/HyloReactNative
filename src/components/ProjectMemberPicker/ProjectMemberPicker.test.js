import 'react-native'
import React from 'react'
import ReactShallowRenderer from 'react-test-renderer/shallow'
import ProjectMemberPicker from './ProjectMemberPicker'

it('renders as expected', () => {
  const props = {
    members: [{id: 'member1'}, {id: 'member2'}],
    style: {styleProp: 1},
    updateMembers: () => {},
    onCancel: () => {}
  }

  const renderer = new ReactShallowRenderer()
  renderer.render(
    <ProjectMemberPicker {...props} />
  )
  const actual = renderer.getRenderOutput()

  expect(actual).toMatchSnapshot()
})
