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
      goToCommunity={() => {}} />)
    const actual = renderer.getRenderOutput()

    expect(actual).toMatchSnapshot()
  })

  it('only displays communities in the selected network', () => {
    const communities = [
      {name: 'community1', network: {id: 1}},
      {name: 'community2', network: {id: 2}},
      {name: 'community3', network: {id: 1}}
    ]
    const selectedNetworkId = 1
    const post = {
      id: 1,
      communities
    }
    const renderer = new ReactShallowRenderer()
    renderer.render(<PostRow
      post={post}
      selectedNetworkId={selectedNetworkId}
      navigate={() => {}}
      goToCommunity={() => {}} />)
    const actual = renderer.getRenderOutput()

    expect(actual).toMatchSnapshot()
  })
})
