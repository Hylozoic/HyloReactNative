import 'react-native'
import React from 'react'
import { render } from '@testing-library/react-native'
import MockedScreen from 'util/testing/MockedScreen'
import Topics, { TopicList, TopicRow, SubscribeStar } from './Topics'

describe('Topics', () => {

  describe('"Support Coming Soon"', () => {
    it('displayed when no community id', () => {
      const props = {
        fetchCommunityTopics: jest.fn()
      }
      const { getByText } = render(
        <MockedScreen>
          {() => <Topics {...props} />}
        </MockedScreen>
      )
      expect(props.fetchCommunityTopics).not.toBeCalled()
      getByText("We're working on expanding #topics to more places.")
    })

    it("not displayed when a community id is present, fetches", () => {
      const props = {
        community: { id: 123 },
        fetchCommunityTopics: jest.fn()
      }
      const { getByText } = render(
        <MockedScreen>
          {() => <Topics {...props} />}
        </MockedScreen>
      )
      expect(props.fetchCommunityTopics).toBeCalled()
      expect(getByText('No topics were found for this community'))
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
        <MockedScreen>
          {() => <Topics {...propsBefore} />}
        </MockedScreen>
      )
      rerender(
        <MockedScreen>
          {() => <Topics {...propsAfter} />}
        </MockedScreen>
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
      <MockedScreen>
        {() => <Topics {...props} />}
      </MockedScreen>
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
      <MockedScreen>
        {() => <Topics {...props} />}
      </MockedScreen>
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
      <MockedScreen>
        {() => <Topics {...propsBefore} />}
      </MockedScreen>
    )
    rerender(
      <MockedScreen>
        {() => <Topics {...propsAfter} />}
      </MockedScreen>
    )
    expect(propsBefore.fetchCommunityTopics).toBeCalled()
    expect(propsAfter.fetchCommunityTopics).toBeCalled()
  })
})

describe('TopicList', () => {
  it('matches last snapshot', () => {
    const props = {
      community: { id: '1' },
      communityHasTopics: true,
      filteredTopics: [
        { name: 'discussion', newPostCount: 1, isSubscribe: false },
        { name: 'tech', newPostCount: 10, isSubscribe: false },
        { name: 'ecotherapy', newPostCount: 2, isSubscribe: true }
      ],
      setTopicSubscribe: () => {},
      goToTopic: () => {}
    }
    const { toJSON } = render(
      <TopicList {...props} />
    )
    expect(toJSON()).toMatchSnapshot()
  })

  it('matches last snapshot with empty list', () => {
    const props = {
      topics: [],
      setTopicSubscribe: () => {},
      goToTopic: () => {}
    }
    const { toJSON } = render(
      <TopicList {...props} />
    )
    expect(toJSON()).toMatchSnapshot()
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
    const { toJSON } = render(
      <TopicRow {...props} />
    )
    expect(toJSON()).toMatchSnapshot()
  })
})

describe('SubscribeStar', () => {
  it('matches last snapshot', () => {
    const props = {
      isSubscribed: true,
      onPress: () => {}
    }
    const { toJSON } = render(
      <SubscribeStar {...props} />
    )
    expect(toJSON()).toMatchSnapshot()
  })
})
