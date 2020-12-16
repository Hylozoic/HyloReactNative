import 'react-native'
import React from 'react'
import ReactShallowRenderer from 'react-test-renderer/shallow'
import TestRenderer from 'react-test-renderer'
import Feed from './Feed'
import { Provider } from 'react-redux'
import orm from 'store/models'
import { createMockStore } from 'util/testing'

it('renders correctly if currentUserHasMemberships', () => {
  const community = {
    id: '1'
  }
  const currentUser = {
    id: '2'
  }
  const newPost = () => {}

  const renderer = new ReactShallowRenderer()
  renderer.render(
    <Feed
      community={community}
      currentUser={currentUser}
      currentUserHasMemberships
      navigation={{}}
      newPost={newPost}
      showPost={() => {}}
      editPost={() => {}}
      goToCommunity={() => {}}
      topicName='amazing'
    />
  )
  const actual = renderer.getRenderOutput()

  expect(actual).toMatchSnapshot()
})

it('renders correctly if currentUserHasMemberships is false', () => {
  const community = {
    id: '1'
  }
  const currentUser = {
    id: '2'
  }
  const newPost = () => {}

  const renderer = new ReactShallowRenderer()
  renderer.render(
    <Feed
      community={community}
      currentUser={currentUser}
      currentUserHasMemberships={false}
      navigation={{}}
      newPost={newPost}
      showPost={() => {}}
      editPost={() => {}}
      goToCommunity={() => {}}
      topicName='amazing'
    />
  )
  const actual = renderer.getRenderOutput()

  expect(actual).toMatchSnapshot()
})

it('calls fetchCommunityTopic on componentDidMount', () => {
  const state = {
    orm: orm.getEmptyState(),
    FeedList: {},
    queryResults: {},
    pending: {}
  }

  const props = {
    navigation: { state: { key: 1 } },
    fetchCommunityTopic: jest.fn(),
    showTopic: jest.fn(),
    showMember: jest.fn(),
    goToCommunity: jest.fn(),
    setTopicSubscribe: jest.fn(),
    newPost: jest.fn()
  }

  const renderer = TestRenderer.create(
    <Provider store={createMockStore(state)}>
      <Feed {...props} />
    </Provider>
  )

  const feed = renderer.root.findByType(Feed).instance
  feed.componentDidMount()
  expect(props.fetchCommunityTopic).toBeCalled()
})
