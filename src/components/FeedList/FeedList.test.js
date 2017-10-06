import 'react-native'
import React from 'react'
import ReactShallowRenderer from 'react-test-renderer/shallow'
import FeedList, { ListControls, ListControl, PostRow, filterOptions } from './FeedList'

describe('FeedList', () => {
  it('renders correctly', () => {
    const renderer = new ReactShallowRenderer()
    renderer.render(<FeedList
      posts={[1, 2, 3]}
      filter='all'
      sortBy='latest'
      setFilter={() => {}}
      setSort={() => {}}
      fetchMorePosts={() => {}}
      pending
      refreshing
      onRefresh={() => {}}
      />)
    const actual = renderer.getRenderOutput()

    expect(actual).toMatchSnapshot()
  })
})

describe('ListControls', () => {
  it('renders correctly', () => {
    const renderer = new ReactShallowRenderer()
    renderer.render(<ListControls
      filter='all'
      sortBy='latest'
      setFilter={() => {}}
      setSort={() => {}} />)
    const actual = renderer.getRenderOutput()

    expect(actual).toMatchSnapshot()
  })
})

describe('ListControl', () => {
  it('renders correctly', () => {
    const renderer = new ReactShallowRenderer()
    renderer.render(<ListControl
      selected='discussion'
      options={filterOptions}
      onChange={() => {}} />)
    const actual = renderer.getRenderOutput()

    expect(actual).toMatchSnapshot()
  })
})

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
})
