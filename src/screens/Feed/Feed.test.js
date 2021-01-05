import 'react-native'
import React from 'react'
import ReactShallowRenderer from 'react-test-renderer/shallow'
import { act } from 'react-test-renderer'
import { render } from '@testing-library/react-native'
import Feed from './Feed'
import { Provider } from 'react-redux'
import orm from 'store/models'
import { createMockStore } from 'util/testing'
import { NavigationContainer } from '@react-navigation/native'
import { createStackNavigator } from '@react-navigation/stack'

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
    <NavigationContainer>
      <Feed
        community={community}
        currentUser={currentUser}
        currentUserHasMemberships
        navigation={{}}
        route={{}}
        newPost={newPost}
        showPost={() => {}}
        editPost={() => {}}
        goToCommunity={() => {}}
        topicName='amazing'
      />
    </NavigationContainer>
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
    <NavigationContainer>
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
    </NavigationContainer>
  )
  const actual = renderer.getRenderOutput()

  expect(actual).toMatchSnapshot()
})

it('calls fetchCommunityTopic on componentDidMount', async () => {
  const state = {
    orm: orm.getEmptyState(),
    FeedList: {},
    queryResults: {},
    pending: {}
  }

  const props = {
    navigation: {},
    fetchCommunityTopic: jest.fn(),
    showTopic: jest.fn(),
    showMember: jest.fn(),
    goToCommunity: jest.fn(),
    setTopicSubscribe: jest.fn(),
    newPost: jest.fn(),
    topicName: 'test-topic'
  }

  const TestStack = createStackNavigator()

  const component = (
    <Provider store={createMockStore(state)}>
      <NavigationContainer>
        <TestStack.Navigator>
          <TestStack.Screen name='Feed'>
            {screenProps => (
              <Feed {...props} {...screenProps} />
            )}
          </TestStack.Screen>
        </TestStack.Navigator>
      </NavigationContainer>
    </Provider>
  )
  const { toJSON } = render(component)

  expect(props.fetchCommunityTopic).toHaveBeenCalledTimes(1)

  await act(async () => {
    expect(toJSON()).toMatchSnapshot()
  })
})


// From FeedBanner
//
// import React from 'react'
// import ReactShallowRenderer from 'react-test-renderer/shallow'
// import TestRenderer from 'react-test-renderer'
// import FeedBanner, { PostPrompt } from './FeedBanner'
// import { TouchableOpacity } from 'react-native'

// jest.mock('react-native-linear-gradient')

// const community = {
//   id: '1',
//   bannerUrl: 'community.png'
// }

// const network = {
//   id: '2',
//   bannerUrl: 'network.png'
// }
// const currentUser = {
//   id: '2',
//   avatarUrl: 'user.png',
//   name: 'John Wayne',
//   firstName: () => 'John'
// }
// const newPost = () => {}

// describe('FeedBanner', () => {
//   it('renders correctly with all=true, and no community or user', () => {
//     const renderer = new ReactShallowRenderer()
//     renderer.render(<FeedBanner
//       all
//       community={{ id: 'anything' }}
//       newPost={newPost}
//                     />)
//     const actual = renderer.getRenderOutput()

//     expect(actual).toMatchSnapshot()
//   })

//   it('renders correctly with a community and user', () => {
//     const renderer = new ReactShallowRenderer()
//     renderer.render(<FeedBanner
//       community={community}
//       currentUser={currentUser}
//       newPost={newPost}
//                     />)
//     const actual = renderer.getRenderOutput()

//     expect(actual).toMatchSnapshot()
//   })

//   it('renders correctly with a network and user', () => {
//     const renderer = new ReactShallowRenderer()
//     renderer.render(<FeedBanner
//       network={network}
//       currentUser={currentUser}
//       newPost={newPost}
//                     />)
//     const actual = renderer.getRenderOutput()

//     expect(actual).toMatchSnapshot()
//   })

//   it('has a topic subscribe toggle button', () => {
//     const setTopicSubscribe = jest.fn()
//     const renderer = TestRenderer.create(
//       <FeedBanner
//         community={{ name: 'Earth' }}
//         topicSubscribed={false}
//         setTopicSubscribe={setTopicSubscribe}
//       />
//     )

//     expect(renderer.toJSON()).toMatchSnapshot()
//     const { root } = renderer
//     root.findByType(TouchableOpacity).props.onPress()
//     expect(root.instance.state.overlayMessage).toEqual('SUBSCRIBED TO TOPIC')
//     expect(setTopicSubscribe).toBeCalled()
//   })
// })

// describe('PostPrompt', () => {
//   it('renders null with no user', () => {
//     const renderer = new ReactShallowRenderer()
//     renderer.render(<PostPrompt
//       newPost={newPost}
//                     />)
//     const actual = renderer.getRenderOutput()

//     expect(actual).toEqual(null)
//   })

//   it('renders correctly with a user', () => {
//     const renderer = new ReactShallowRenderer()
//     renderer.render(<PostPrompt
//       currentUser={currentUser}
//       newPost={newPost}
//                     />)
//     const actual = renderer.getRenderOutput()

//     expect(actual).toMatchSnapshot()
//   })
// })









