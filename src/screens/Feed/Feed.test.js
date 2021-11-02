import 'react-native'
import React from 'react'
import ReactShallowRenderer from 'react-test-renderer/shallow'
import { render } from '@testing-library/react-native'
import Feed from './Feed'
import { Provider } from 'react-redux'
import orm from 'store/models'
import { createMockStore } from 'util/testing'
import { NavigationContainer } from '@react-navigation/native'
import { createStackNavigator } from '@react-navigation/stack'

it('renders correctly if currentUserHasMemberships', () => {
  const group = {
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
        group={group}
        currentUser={currentUser}
        currentUserHasMemberships
        navigation={{}}
        route={{}}
        newPost={newPost}
        showPost={() => {}}
        editPost={() => {}}
        goToGroup={() => {}}
        topicName='amazing'
      />
    </NavigationContainer>
  )
  const actual = renderer.getRenderOutput()

  expect(actual).toMatchSnapshot()
})

it('renders correctly if currentUserHasMemberships is false', () => {
  const group = {
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
        group={group}
        currentUser={currentUser}
        currentUserHasMemberships={false}
        navigation={{}}
        newPost={newPost}
        showPost={() => {}}
        editPost={() => {}}
        goToGroup={() => {}}
        topicName='amazing'
      />
    </NavigationContainer>
  )
  const actual = renderer.getRenderOutput()

  expect(actual).toMatchSnapshot()
})

it('calls fetchGroupTopic on componentDidMount', async () => {
  const state = {
    orm: orm.getEmptyState(),
    FeedList: {},
    queryResults: {},
    pending: {}
  }

  const props = {
    navigation: {},
    fetchGroupTopic: jest.fn(),
    showTopic: jest.fn(),
    showMember: jest.fn(),
    goToGroup: jest.fn(),
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

  expect(props.fetchGroupTopic).toHaveBeenCalledTimes(1)

  expect(await toJSON()).toMatchSnapshot()
})


// From FeedBanner
//
// import React from 'react'
// import ReactShallowRenderer from 'react-test-renderer/shallow'
// import TestRenderer from 'react-test-renderer'
// import FeedBanner, { PostPrompt } from './FeedBanner'
// import { TouchableOpacity } from 'react-native'

// jest.mock('react-native-linear-gradient')

// const group = {
//   id: '1',
//   bannerUrl: 'group.png'
// }

// const currentUser = {
//   id: '2',
//   avatarUrl: 'user.png',
//   name: 'John Wayne',
//   firstName: () => 'John'
// }
// const newPost = () => {}

// describe('FeedBanner', () => {
//   it('renders correctly with all=true, and no group or user', () => {
//     const renderer = new ReactShallowRenderer()
//     renderer.render(<FeedBanner
//       all
//       group={{ id: 'anything' }}
//       newPost={newPost}
//                     />)
//     const actual = renderer.getRenderOutput()

//     expect(actual).toMatchSnapshot()
//   })

//   it('renders correctly with a group and user', () => {
//     const renderer = new ReactShallowRenderer()
//     renderer.render(<FeedBanner
//       group={group}
//       currentUser={currentUser}
//       newPost={newPost}
//                     />)
//     const actual = renderer.getRenderOutput()

//     expect(actual).toMatchSnapshot()
//   })

//   it('renders correctly with a user', () => {
//     const renderer = new ReactShallowRenderer()
//     renderer.render(<FeedBanner
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
//         group={{ name: 'Earth' }}
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









