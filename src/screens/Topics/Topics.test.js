import 'react-native'
import React from 'react'
import { render } from '@testing-library/react-native'
import MockedScreen from 'util/testing/MockedScreen'
import Topics, { TopicList, TopicRow, SubscribeStar } from './Topics'

describe('Topics', () => {
  it('renders correctly a group and topics', async () => {
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
    expect(await toJSON()).toMatchSnapshot()
  })

  it('renders correctly with pending=true', async () => {
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
    expect(await toJSON()).toMatchSnapshot()
  })

  it('refetches when rerendered with a different groupId', async () => {
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
    await rerender(
      <MockedScreen>
        {() => <Topics {...propsAfter} />}
      </MockedScreen>
    )
    expect(propsBefore.fetchGroupTopics).toBeCalled()
    expect(propsAfter.fetchGroupTopics).toBeCalled()
  })
})

describe('TopicList', () => {
  it('matches last snapshot', async () => {
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
    expect(await toJSON()).toMatchSnapshot()
  })

  it('matches last snapshot with empty list', async () => {
    const props = {
      topics: [],
      setTopicSubscribe: () => {},
      goToTopic: () => {}
    }
    const { toJSON } = render(
      <TopicList {...props} />
    )
    expect(await toJSON()).toMatchSnapshot()
  })
})

describe('TopicRow', () => {
  it('matches last snapshot', async () => {
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
    expect(await toJSON()).toMatchSnapshot()
  })
})

describe('SubscribeStar', () => {
  it('matches last snapshot', async () => {
    const props = {
      isSubscribed: true,
      onPress: () => {}
    }
    const { toJSON } = render(
      <SubscribeStar {...props} />
    )
    expect(await toJSON()).toMatchSnapshot()
  })
})
