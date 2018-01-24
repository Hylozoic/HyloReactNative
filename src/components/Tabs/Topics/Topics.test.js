import 'react-native'
import React from 'react'
import ReactTestRenderer from 'react-test-renderer'
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

  describe('componentDidMount', () => {
    it('redirects when it should', () => {
      const props = {
        shouldRedirect: true,
        goToComingSoon: jest.fn(),
        fetchCommunityTopics: jest.fn(),
        community: {},
        topics: []
      }

      const instance = ReactTestRenderer.create(<Topics {...props} />).getInstance()

      instance.componentDidMount()
      expect(props.goToComingSoon).toBeCalled()
      expect(props.fetchCommunityTopics).not.toBeCalled()
    })
  })

  it('calls fetchCommunityTopics when it should not redirect', () => {
    const props = {
      shouldRedirect: false,
      goToComingSoon: jest.fn(),
      fetchCommunityTopics: jest.fn(),
      community: {},
      topics: []
    }

    const instance = ReactTestRenderer.create(<Topics {...props} />).getInstance()

    instance.componentDidMount()
    expect(props.goToComingSoon).not.toBeCalled()
    expect(props.fetchCommunityTopics).toBeCalled()
  })

  describe('componentDidUpdate', () => {
    it('redirects when shouldRedirect changes', () => {
      const props = {
        shouldRedirect: true,
        goToComingSoon: jest.fn(),
        fetchCommunityTopics: jest.fn(),
        community: {},
        topics: []
      }

      const prevProps = {
        shouldRedirect: false
      }

      const instance = ReactTestRenderer.create(<Topics {...props} />).getInstance()

      instance.componentDidUpdate(prevProps)
      expect(props.goToComingSoon).toBeCalled()
      expect(props.fetchCommunityTopics).not.toBeCalled()
    })

    it('calls fetchCommunityTopics when community id changes', () => {
      const props = {
        shouldRedirect: false,
        goToComingSoon: jest.fn(),
        fetchCommunityTopics: jest.fn(),
        community: {id: 123},
        topics: []
      }

      const prevProps = {
        shouldRedirect: false,
        community: {id: 543}
      }

      const instance = ReactTestRenderer.create(<Topics {...props} />).getInstance()

      instance.componentDidUpdate(prevProps)
      expect(props.goToComingSoon).not.toBeCalled()
      expect(props.fetchCommunityTopics).toBeCalled()
    })
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
