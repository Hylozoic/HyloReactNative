import 'react-native'
import React from 'react'
import ReactShallowRenderer from 'react-test-renderer/shallow'
import FeedList from './FeedList'
import { TestRoot } from 'util/testing'

describe('FeedList', () => {
  it('renders correctly', () => {
    const renderer = new ReactShallowRenderer()
    renderer.render(
      <TestRoot>
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
      </TestRoot>
    )
    const actual = renderer.getRenderOutput()

    expect(actual).toMatchSnapshot()
  })
})
