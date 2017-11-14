import 'react-native'
import React from 'react'
import ReactShallowRenderer from 'react-test-renderer/shallow'
import TestRenderer from 'react-test-renderer'
import FeedList, { ListControls, ListControl, PostRow, filterOptions } from './FeedList'

jest.mock('react-native-device-info')

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
      refreshPosts={() => {}} />)
    const actual = renderer.getRenderOutput()

    expect(actual).toMatchSnapshot()
  })

  it('fetches if the Home tab has just become visible', () => {
    const fetchPosts = jest.fn()
    const { root: { instance } } = TestRenderer.create(<FeedList
      screenProps={{currentTabName: 'Home'}}
      fetchPosts={fetchPosts} />)

    instance.componentDidUpdate({screenProps: {currentTabName: 'Members'}})
    expect(fetchPosts).toHaveBeenCalledTimes(2)
  })

  it('does not fetch if the Home tab is not visible', () => {
    const fetchPosts = jest.fn()
    const { root: { instance } } = TestRenderer.create(<FeedList
      screenProps={{currentTabName: 'Members'}}
      fetchPosts={fetchPosts} />)

    instance.componentDidUpdate({screenProps: {}})
    expect(fetchPosts).toHaveBeenCalledTimes(1)
  })

  it('does not fetch if the Home tab is and was visible', () => {
    const fetchPosts = jest.fn()
    const { root: { instance } } = TestRenderer.create(<FeedList
      screenProps={{currentTabName: 'Home'}}
      fetchPosts={fetchPosts} />)

    instance.componentDidUpdate({screenProps: {currentTabName: 'Home'}})
    expect(fetchPosts).toHaveBeenCalledTimes(1)
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

  it('only displays communities in the selected network', () => {
    const communities = [
      {name: 'community1', network: {id: 1}},
      {name: 'community2', network: {id: 2}},
      {name: 'community3', network: {id: 1}}
    ]
    const post = {
      id: 1,
      communities
    }
    const renderer = new ReactShallowRenderer()
    renderer.render(<PostRow
      post={post}
      selectedNetworkId={1}
      navigate={() => {}}
      goToCommunity={() => {}} />)
    const actual = renderer.getRenderOutput()

    expect(actual).toMatchSnapshot()
  })
})
