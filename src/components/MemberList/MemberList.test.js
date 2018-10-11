import 'react-native'
import React from 'react'
import ReactShallowRenderer from 'react-test-renderer/shallow'
import MemberList from './MemberList'

describe('MemberList', () => {
  it('renders with default props with default non-server search', () => {
    const renderer = new ReactShallowRenderer()
    const testProps = {
      members: [
        {id: '1', name: 'Loren'},
        {id: '2', name: 'Robbie'}
      ]
    }

    renderer.render(
      <MemberList {...testProps} />
    )

    const actual = renderer.getRenderOutput()

    expect(actual).toMatchSnapshot()
  })

  it('renders with default props and server search', () => {
    const renderer = new ReactShallowRenderer()
    const testProps = {
      isServerSearch: true,
      members: [
        {id: '1', name: 'Loren'},
        {id: '2', name: 'Robbie'}
      ]
    }

    renderer.render(
      <MemberList {...testProps} />
    )

    const actual = renderer.getRenderOutput()

    expect(actual).toMatchSnapshot()
  })
})
