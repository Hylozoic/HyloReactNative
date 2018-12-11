import React from 'react'
import ReactShallowRenderer from 'react-test-renderer/shallow'
import ProjectMembersSummary from './ProjectMembersSummary'

describe('ProjectMembersSummary', () => {
  it('renders as expected', () => {
    const props = {
      count: 5,
      members: [],
      goToMembers: () => {}
    }
    const renderer = new ReactShallowRenderer()
    renderer.render(
      <ProjectMembersSummary {...props} />
    )
    const actual = renderer.getRenderOutput()
    expect(actual).toMatchSnapshot()
  })
})
