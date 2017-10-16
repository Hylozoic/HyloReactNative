import 'react-native'
import React from 'react'
import ReactShallowRenderer from 'react-test-renderer/shallow'
import InviteExpired from './InviteExpired'

describe('InviteExpired', () => {
  it('matches the last snapshot', () => {
    const renderer = new ReactShallowRenderer()
    renderer.render(<InviteExpired />)
    const actual = renderer.getRenderOutput()

    expect(actual).toMatchSnapshot()
  })
})
