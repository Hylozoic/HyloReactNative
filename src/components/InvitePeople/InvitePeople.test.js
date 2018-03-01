import 'react-native'
import React from 'react'
import ReactShallowRenderer from 'react-test-renderer/shallow'
import InvitePeople from './InvitePeople'

describe('InviteExpired', () => {
  it('matches the last snapshot', () => {
    const renderer = new ReactShallowRenderer()
    renderer.render(<InvitePeople />)
    const actual = renderer.getRenderOutput()

    expect(actual).toMatchSnapshot()
  })
})
