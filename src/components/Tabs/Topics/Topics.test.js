import 'react-native'
import React from 'react'
import ReactShallowRenderer from 'react-test-renderer/shallow'
import Topics, { TopicList, TopicRow, SubscribeStar } from './Topics'

jest.mock('react-native-device-info')

describe('Topics', () => {
  it('renders correctly a community and topics', () => {
    const renderer = new ReactShallowRenderer()
    const props = {
      community: {
        name: 'Foomunity',
        bannerUrl: 'community-banner.png'
      },
      topics: [1, 2, 3],
      setTopicSubscribe: () => {},
      goToTopic: () => {}
    }
    renderer.render(<Topics {...props} />)
    const actual = renderer.getRenderOutput()

    expect(actual).toMatchSnapshot()
  })

  it('renders correctly with pending=true', () => {
    const renderer = new ReactShallowRenderer()
    const props = {
      community: {
        name: 'Foomunity',
        bannerUrl: 'community-banner.png'
      },
      topics: [1, 2, 3],
      pending: true,
      setTopicSubscribe: () => {},
      goToTopic: () => {}
    }
    renderer.render(<Topics {...props} />)
    const actual = renderer.getRenderOutput()

    expect(actual).toMatchSnapshot()
  })
})

describe('TopicList', () => {
  it('matches last snapshot', () => {
    const props = {
      topics: [1, 2, 3],
      setTopicSubscribe: () => {},
      goToTopic: () => {}
    }
    const renderer = new ReactShallowRenderer()
    renderer.render(<TopicList {...props} />)
    const actual = renderer.getRenderOutput()
    expect(actual).toMatchSnapshot()
  })
})

describe('TopicRow', () => {
  it('matches last snapshot', () => {
    const props = {
      topic: {
        name: 'theTopic',
        newPostCount: 4,
        isSubscribed: true
      },
      setTopicSubscribe: () => {},
      goToTopic: () => {}
    }
    const renderer = new ReactShallowRenderer()
    renderer.render(<TopicRow {...props} />)
    const actual = renderer.getRenderOutput()
    expect(actual).toMatchSnapshot()
  })
})

describe('SubscribeStar', () => {
  it('matches last snapshot', () => {
    const props = {
      isSubscribed: true,
      onPress: () => {}
    }
    const renderer = new ReactShallowRenderer()
    renderer.render(<SubscribeStar {...props} />)
    const actual = renderer.getRenderOutput()
    expect(actual).toMatchSnapshot()
  })
})
