import React from 'react'
import ReactShallowRenderer from 'react-test-renderer/shallow'
import GroupSettingsMenu from './GroupSettingsMenu'
import ReactTestRenderer from 'react-test-renderer'

describe('GroupSettingsMenu', () => {
  it('matches the last snapshot', () => {
    const renderer = new ReactShallowRenderer()
    renderer.render(<GroupSettingsMenu groupName='foo' />)
    const actual = renderer.getRenderOutput()

    expect(actual).toMatchSnapshot()
  })
})