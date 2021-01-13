import 'react-native'
import React from 'react'
import ReactShallowRenderer from 'react-test-renderer/shallow'
import TestRenderer from 'react-test-renderer'
import FeedList, { ListControls, ListControl, filterOptions } from './FeedList'

describe('FeedList', () => {
  it('renders correctly', () => {
    const renderer = new ReactShallowRenderer()
    renderer.render(
      <FeedList
        postIds={[1, 2, 3]}
        filter='all'
        sortBy='latest'
        setFilter={() => {}}
        setSort={() => {}}
        fetchMorePosts={() => {}}
        pending
        refreshPosts={() => {}}
      />
    )
    const actual = renderer.getRenderOutput()

    expect(actual).toMatchSnapshot()
  })
})

describe('ListControls', () => {
  it('renders correctly', () => {
    const renderer = new ReactShallowRenderer()
    renderer.render(
      <ListControls
        filter='all'
        sortBy='latest'
        setFilter={() => {}}
        setSort={() => {}}
      />
    )
    const actual = renderer.getRenderOutput()
    expect(actual).toMatchSnapshot()
  })
})

describe('ListControl', () => {
  it('renders correctly', () => {
    const renderer = new ReactShallowRenderer()
    renderer.render(
      <ListControl
        selected='discussion'
        options={filterOptions}
        onChange={() => {}}
      />
    )
    const actual = renderer.getRenderOutput()
    expect(actual).toMatchSnapshot()
  })
})
