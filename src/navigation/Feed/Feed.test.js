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
  renderer.render(<Feed
    community={community}
    currentUser={currentUser}
    currentUserHasMemberships
    navigation={{}}
    newPost={newPost}
    showPost={() => {}}
    editPost={() => {}}
    goToCommunity={() => {}}
    topicName='amazing'
                  />)
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
    topicName='amazing'
                  />)
  const actual = renderer.getRenderOutput()

  expect(actual).toMatchSnapshot()
})

// it('sets the title to the community if there is a topic', () => {
//   const route = {
//     params: {
//       communityName: 'test community',
//       topicName: 'math'
//     }
//   }

//   expect(Feed.navigationOptions({ route })).toEqual({
//     headerTitle: 'test community'
//   })
// })

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
  feed.onShowTopic('topicName')
  expect(props.showTopic).toHaveBeenCalledWith('topicName')
  feed.onShowMember(1)
  expect(props.showMember).toHaveBeenCalledWith(1)
  feed.onGoToCommunity('community1')
  expect(props.goToCommunity).toHaveBeenCalledWith('community1')
  feed.onSetTopicSubscribe(3, 4, 5)
  expect(props.setTopicSubscribe).toHaveBeenCalledWith(3, 4, 5)
  feed.onNewPost(1, 2, 3)
  expect(props.newPost).toHaveBeenCalledWith(1, 2, 3)
})