import React from 'react'
import ReactShallowRenderer from 'react-test-renderer/shallow'
import TestRenderer from 'react-test-renderer'
import FeedBanner, { PostPrompt } from './FeedBanner'
import { TouchableOpacity } from 'react-native'

jest.mock('react-native-linear-gradient')
jest.mock('react-native-device-info')

const community = {
  id: '1',
  bannerUrl: 'community.png'
}

const network = {
  id: '2',
  bannerUrl: 'network.png'
}
const currentUser = {
  id: '2',
  avatarUrl: 'user.png',
  name: 'John Wayne',
  firstName: () => 'John'
}
const newPost = () => {}

describe('FeedBanner', () => {
  it('renders correctly with all=true, and no community or user', () => {
    const renderer = new ReactShallowRenderer()
    renderer.render(<FeedBanner
      all
      community={{id: 'anything'}}
      newPost={newPost} />)
    const actual = renderer.getRenderOutput()

    expect(actual).toMatchSnapshot()
  })

  it('renders correctly with a community and user', () => {
    const renderer = new ReactShallowRenderer()
    renderer.render(<FeedBanner
      community={community}
      currentUser={currentUser}
      newPost={newPost} />)
    const actual = renderer.getRenderOutput()

    expect(actual).toMatchSnapshot()
  })

  it('renders correctly with a network and user', () => {
    const renderer = new ReactShallowRenderer()
    renderer.render(<FeedBanner
      network={network}
      currentUser={currentUser}
      newPost={newPost} />)
    const actual = renderer.getRenderOutput()

    expect(actual).toMatchSnapshot()
  })

  it('has a topic subscribe toggle button', () => {
    const setTopicSubscribe = jest.fn()
    const renderer = TestRenderer.create(
      <FeedBanner community={{name: 'Earth'}}
        topicSubscribed={false}
        setTopicSubscribe={setTopicSubscribe} />
    )

    expect(renderer.toJSON()).toMatchSnapshot()
    const { root } = renderer
    root.findByType(TouchableOpacity).props.onPress()
    expect(root.instance.state.overlayMessage).toEqual('SUBSCRIBED TO TOPIC')
    expect(setTopicSubscribe).toBeCalled()
  })
})

describe('PostPrompt', () => {
  it('renders null with no user', () => {
    const renderer = new ReactShallowRenderer()
    renderer.render(<PostPrompt
      newPost={newPost} />)
    const actual = renderer.getRenderOutput()

    expect(actual).toEqual(null)
  })

  it('renders correctly with a user', () => {
    const renderer = new ReactShallowRenderer()
    renderer.render(<PostPrompt
      currentUser={currentUser}
      newPost={newPost} />)
    const actual = renderer.getRenderOutput()

    expect(actual).toMatchSnapshot()
  })
})
