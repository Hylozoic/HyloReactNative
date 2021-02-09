import 'react-native'
import React from 'react'
import ReactShallowRenderer from 'react-test-renderer/shallow'
import PostRow from './PostRow'

describe('PostRow', () => {
  it('renders correctly', () => {
    const post = {
      id: 1
    }
    const renderer = new ReactShallowRenderer()
    renderer.render(<PostRow
      post={post}
      navigate={() => {}}
      goToGroup={() => {}}
                    />)
    const actual = renderer.getRenderOutput()

    expect(actual).toMatchSnapshot()
  })

  it('only displays groups in the selected network', () => {
    const groups = [
      { name: 'group1', network: { id: 1 } },
      { name: 'group2', network: { id: 2 } },
      { name: 'group3', network: { id: 1 } }
    ]
    const selectedNetworkId = 1
    const post = {
      id: 1,
      groups
    }
    const renderer = new ReactShallowRenderer()
    renderer.render(<PostRow
      post={post}
      selectedNetworkId={selectedNetworkId}
      navigate={() => {}}
      goToGroup={() => {}}
                    />)
    const actual = renderer.getRenderOutput()

    expect(actual).toMatchSnapshot()
  })
})
