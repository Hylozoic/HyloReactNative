import 'react-native'
import React from 'react'
import ReactShallowRenderer from 'react-test-renderer/shallow'
import TestRenderer from 'react-test-renderer'
import FeedList, { ListControls, ListControl, filterOptions } from './FeedList'

describe('FeedList', () => {
  it('renders correctly', () => {
    const renderer = new ReactShallowRenderer()
    renderer.render(<FeedList
      postIds={[1, 2, 3]}
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
      route={{ name: 'Home' }}
      fetchPosts={fetchPosts} />)

    instance.componentDidUpdate({screenProps: {currentTabName: 'Members'}})
    expect(fetchPosts).toHaveBeenCalledTimes(1)
  })

  it('does not fetch if the Home tab is not visible', () => {
    const fetchPosts = jest.fn()
    const { root: { instance } } = TestRenderer.create(<FeedList
      route={{ name: 'Members' }}
      fetchPosts={fetchPosts} />)

    instance.componentDidUpdate({screenProps: {}})
    expect(fetchPosts).toHaveBeenCalledTimes(1)
  })

  it('does not fetch if the Home tab is and was visible', () => {
    const fetchPosts = jest.fn()
    const { root: { instance } } = TestRenderer.create(<FeedList
      route={{ name: 'Home' }}
      fetchPosts={fetchPosts} />)

    instance.componentDidUpdate({route: { name: 'Home' }})
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
