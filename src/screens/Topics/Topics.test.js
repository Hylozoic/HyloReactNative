import 'react-native'
import React from 'react'
import { render, cleanup } from '@testing-library/react-native'
import MockedScreen from 'util/testing/MockedScreen'
import Topics, { TopicList, TopicRow, SubscribeStar } from './Topics'
import { ReactNativeTestingLibraryRoot } from 'util/testing'

describe('Topics', () => {
  afterEach(cleanup)

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
      <ReactNativeTestingLibraryRoot>
        <MockedScreen>
          {() => (
            <Topics {...props} />
          )}
        </MockedScreen>
      </ReactNativeTestingLibraryRoot>
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
      <ReactNativeTestingLibraryRoot>
        <MockedScreen>
          {() => (
            <Topics {...props} />
          )}
        </MockedScreen>
      </ReactNativeTestingLibraryRoot>
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
      <ReactNativeTestingLibraryRoot>
        <MockedScreen>
          {() => (
            <Topics {...propsBefore} />
          )}
        </MockedScreen>
      </ReactNativeTestingLibraryRoot>
    )
    await rerender(
      <ReactNativeTestingLibraryRoot>
        <MockedScreen>
          {() => (
            <Topics {...propsAfter} />
          )}
        </MockedScreen>
      </ReactNativeTestingLibraryRoot>
    )
    expect(propsBefore.fetchGroupTopics).toBeCalled()
    expect(propsAfter.fetchGroupTopics).toBeCalled()
  })
})

describe('TopicList', () => {
  afterEach(cleanup)

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
  afterEach(cleanup)

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
  afterEach(cleanup)

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
