import React from 'react'
import ReactShallowRenderer from 'react-test-renderer/shallow'
import CommunitySettingsMenu from './CommunitySettingsMenu'
import ReactTestRenderer from 'react-test-renderer'

describe('CommunitySettingsMenu', () => {
  it('matches the last snapshot', () => {
    const renderer = new ReactShallowRenderer()
    renderer.render(<CommunitySettingsMenu communityName='foo' />)
    const actual = renderer.getRenderOutput()

    expect(actual).toMatchSnapshot()
  })
})