import React from 'react'
import ReactShallowRenderer from 'react-test-renderer/shallow'
import CommunitySettings from './CommunitySettings'

describe('CommunitySettings', () => {
  it('matches the last snapshot', () => {
    const renderer = new ReactShallowRenderer()
    renderer.render(<CommunitySettings communityName='foo' />)
    const actual = renderer.getRenderOutput()

    expect(actual).toMatchSnapshot()
  })

  it('has navigation options', () => {
    const props = {navigation: {state: {params: {}}}}
    expect(CommunitySettings.navigationOptions(props)).toMatchSnapshot()
  })
})
