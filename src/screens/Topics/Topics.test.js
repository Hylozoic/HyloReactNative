import 'react-native'
import React from 'react'
import { render } from '@testing-library/react-native'
import ReactShallowRenderer from 'react-test-renderer/shallow'
import Topics, { TopicList, TopicRow, SubscribeStar } from './Topics'
import './TopicSupportComingSoon'
import '@react-navigation/native'

jest.mock('./TopicSupportComingSoon', () => 'TopicSupportComingSoon')
jest.mock('@react-navigation/native')

describe('Topics', () => {
  describe('"Support Coming Soon"', () => {
    it('displayed when no community id', () => {
      const props = {
        fetchCommunityTopics: jest.fn()
      }
      const { toJSON } = render(
        <Topics {...props} />
      )
      expect(props.fetchCommunityTopics).not.toBeCalled()
      expect(toJSON()).toMatchSnapshot()
    })

    it("not displayed when a community id is present, fetches", () => {
      const props = {
        community: { id: 123 },
        fetchCommunityTopics: jest.fn()
      }
      const { toJSON } = render(
        <Topics {...props} />
      )
      expect(props.fetchCommunityTopics).toBeCalled()
      expect(toJSON()).toMatchSnapshot()
    })

    it('fetches when rerendered with a communityId', () => {
      const propsBefore = {
        fetchCommunityTopics: jest.fn()
      }
      const propsAfter = {
        community: { id: 123 },
        fetchCommunityTopics: jest.fn()
      }
      const { rerender } = render(
        <Topics {...propsBefore} />
      )
      rerender(
        <Topics {...propsAfter} />
      )
      expect(propsBefore.fetchCommunityTopics).not.toBeCalled()
      expect(propsAfter.fetchCommunityTopics).toBeCalled()
    })
  })

  it('renders correctly a community and topics', () => {
    const props = {
      fetchCommunityTopics: () => {},
      community: {
        id: 123,
        name: 'Foomunity',
        bannerUrl: 'community-banner.png'
      },
      topics: [1, 2, 3],
      setTopicSubscribe: () => {},
      goToTopic: () => {}
    }
    const { toJSON } = render(
      <Topics {...props} />
    )
    expect(toJSON()).toMatchSnapshot()
  })

  it('renders correctly with pending=true', () => {
    const props = {
      fetchCommunityTopics: () => {},
      community: {
        id: 123,
        name: 'Foomunity',
        bannerUrl: 'community-banner.png'
      },
      topics: [1, 2, 3],
      pending: true,
      setTopicSubscribe: () => {},
      goToTopic: () => {}
    }
    const { toJSON } = render(
      <Topics {...props} />
    )
    expect(toJSON()).toMatchSnapshot()
  })

  it('refetches when rerendered with a different communityId', () => {
    const propsBefore = {
      community: { id: 333 },
      fetchCommunityTopics: jest.fn()
    }
    const propsAfter = {
      community: { id: 222 },
      fetchCommunityTopics: jest.fn()
    }
    const { rerender } = render(
      <Topics {...propsBefore} />
    )
    rerender(
      <Topics {...propsAfter} />
    )
    expect(propsBefore.fetchCommunityTopics).toBeCalled()
    expect(propsAfter.fetchCommunityTopics).toBeCalled()
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

  it('matches last snapshot with empty list', () => {
    const props = {
      topics: [],
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
