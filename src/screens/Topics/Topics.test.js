import 'react-native'
import React from 'react'
import { render } from '@testing-library/react-native'
import MockedScreen from 'util/testing/MockedScreen'
import Topics, { TopicList, TopicRow, SubscribeStar } from './Topics'

describe('Topics', () => {

  describe('"Support Coming Soon"', () => {
    it('displayed when no group id', () => {
      const props = {
        fetchGroupTopics: jest.fn()
      }
      const { getByText } = render(
        <MockedScreen>
          {() => <Topics {...props} />}
        </MockedScreen>
      )
      expect(props.fetchGroupTopics).not.toBeCalled()
      getByText("We're working on expanding #topics to more places.")
    })

    it("not displayed when a group id is present, fetches", () => {
      const props = {
        group: { id: 123 },
        fetchGroupTopics: jest.fn()
      }
      const { getByText } = render(
        <MockedScreen>
          {() => <Topics {...props} />}
        </MockedScreen>
      )
      expect(props.fetchGroupTopics).toBeCalled()
      expect(getByText('No topics were found for this group'))
    })

    it('fetches when rerendered with a groupId', () => {
      const propsBefore = {
        fetchGroupTopics: jest.fn()
      }
      const propsAfter = {
        group: { id: 123 },
        fetchGroupTopics: jest.fn()
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
      expect(propsBefore.fetchGroupTopics).not.toBeCalled()
      expect(propsAfter.fetchGroupTopics).toBeCalled()
    })
  })

  it('renders correctly a group and topics', () => {
    const props = {
      fetchGroupTopics: () => {},
      group: {
        id: 123,
        name: 'Foomunity',
        bannerUrl: 'group-banner.png'
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
      fetchGroupTopics: () => {},
      group: {
        id: 123,
        name: 'Foomunity',
        bannerUrl: 'group-banner.png'
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

  it('refetches when rerendered with a different groupId', () => {
    const propsBefore = {
      group: { id: 333 },
      fetchGroupTopics: jest.fn()
    }
    const propsAfter = {
      group: { id: 222 },
      fetchGroupTopics: jest.fn()
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
    expect(propsBefore.fetchGroupTopics).toBeCalled()
    expect(propsAfter.fetchGroupTopics).toBeCalled()
  })
})

describe('TopicList', () => {
  it('matches last snapshot', () => {
    const props = {
      group: { id: '1' },
      groupHasTopics: true,
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
