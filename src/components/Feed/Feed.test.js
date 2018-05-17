import 'react-native'
import React from 'react'
import ReactShallowRenderer from 'react-test-renderer/shallow'
import TestRenderer from 'react-test-renderer'
import Feed from './Feed'
import { Provider } from 'react-redux'
import orm from 'store/models'
import { createMockStore } from 'util/testing'

jest.mock('react-native-device-info')

it('renders correctly if currentUserHasMemberships', () => {
  const community = {
    id: '1'
  }
  const currentUser = {
    id: '2'
  }
  const newPost = () => {}

  const renderer = new ReactShallowRenderer()
  renderer.render(<Feed
    community={community}
    currentUser={currentUser}
    currentUserHasMemberships
    navigation={{}}
    newPost={newPost}
    showPost={() => {}}
    editPost={() => {}}
    goToCommunity={() => {}}
    topicName={'amazing'} />)
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
  renderer.render(<Feed
    community={community}
    currentUser={currentUser}
    currentUserHasMemberships={false}
    navigation={{}}
    newPost={newPost}
    showPost={() => {}}
    editPost={() => {}}
    goToCommunity={() => {}}
    topicName={'amazing'} />)
  const actual = renderer.getRenderOutput()

  expect(actual).toMatchSnapshot()
})


it('sets the title to the community if there is a topic', () => {
  const navigation = {
    state: {
      params: {
        communityName: 'test community',
        topicName: 'math'
      }
    }
  }

  expect(Feed.navigationOptions({ navigation })).toEqual({
    headerTitle: 'test community'
  })
})

it('calls fetchCommunityTopic on componentDidMount', () => {
  const fetchCommunityTopic = jest.fn()
  const state = {
    orm: orm.getEmptyState(),
    FeedList: {},
    queryResults: {},
    pending: {}
  }

  const renderer = TestRenderer.create(
    <Provider store={createMockStore(state)}>
      <Feed fetchCommunityTopic={fetchCommunityTopic} navigation={{ state: { key: 1 } }} />
    </Provider>
  )

  const feed = renderer.root.findByType(Feed).instance
  feed.componentDidMount()
  expect(fetchCommunityTopic).toBeCalled()
})
