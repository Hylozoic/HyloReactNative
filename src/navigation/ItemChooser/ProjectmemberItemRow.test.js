import React from 'react'
import ReactShallowRenderer from 'react-test-renderer/shallow'
import ProjectMemberItemRow from './ProjectMemberItemRow'

it('renders as expected', () => {
  const props = {
    item: { id: 1 },
    onPress: () => {}
  }
  const renderer = new ReactShallowRenderer()
  renderer.render(<ProjectMemberItemRow {...props} />)
  expect(renderer.getRenderOutput()).toMatchSnapshot()
})
