import React from 'react'
import { TouchableOpacity } from 'react-native'
import TestRenderer from 'react-test-renderer'
import ReactShallowRenderer from 'react-test-renderer/shallow'
import ThreadList, { MessageRow } from './ThreadList'

jest.mock('react-native-device-info')

describe('ThreadList', () => {
  it('renders correctly', () => {
    const threads = [{id: 1, participants: [{id: 1, avatarUrl: 'blah'}], lastMessage: {id: 1}}]
    const renderer = TestRenderer.create(<ThreadList threads={threads} />)

    expect(renderer.toJSON()).toMatchSnapshot()
  })

  it('fetches threads initially when empty', () => {
    const fetchThreads = jest.fn()
    const renderer = TestRenderer.create(
      <ThreadList
        fetchThreads={fetchThreads}
        hasMore
        pending={false}
        threads={[]} />
    )
    expect(fetchThreads).toHaveBeenCalled()
    renderer.getInstance().setState({ ready: true })
    expect(renderer.toJSON()).toMatchSnapshot()
  })

  it('handles pending correctly without threads', () => {
    const renderer = new ReactShallowRenderer()
    const threads = []
    const pending = true
    renderer.render(<ThreadList threads={threads} pending={pending} />)
    const actual = renderer.getRenderOutput()

    expect(actual).toMatchSnapshot()
  })

  it('handles pending correctly with threads', () => {
    const renderer = TestRenderer.create(
      <ThreadList
        fetchThreads={() => {}}
        pending
        threads={[{ id: 1 }]} />
    )
    expect(renderer.toJSON()).toMatchSnapshot()
  })

  it('handles when there are no threads correctly', () => {
    const renderer = TestRenderer.create(
      <ThreadList
        fetchThreads={() => {}}
        pending={false}
        threads={[]} />
    )
    renderer.getInstance().setState({ ready: true })
    expect(renderer.toJSON()).toMatchSnapshot()
  })

  it('sets the navigationOptions', () => {
    const navigation = {
      navigate: jest.fn(),
      state: {}
    }
    const navigationOptions = ThreadList.navigationOptions({navigation})
    expect(navigationOptions).toMatchSnapshot()
    navigationOptions.headerRight.props.onPress()
    expect(navigation.navigate).toHaveBeenCalledWith('NewMessage')
  })
})

describe('MessageRow', () => {
  it('renders correctly', () => {
    const message = [
      {
        id: 1,
        '_fields': {
          creator: 1
        }
      }
    ]
    const participants = [{id: 2}]
    const renderer = new ReactShallowRenderer()
    renderer.render(<MessageRow
      message={message}
      participants={participants} />)
    const actual = renderer.getRenderOutput()
    expect(actual).toMatchSnapshot()
  })

  it('calls showThread', () => {
    const showThread = jest.fn()
    const currentUser = {
      id: 1
    }
    const message = {
      id: 1,
      '_fields': {
        creator: 2
      }
    }

    const participants = [{id: 2, avatarUrl: 'blah'}]

    const renderer = TestRenderer.create(
      <MessageRow
        showThread={showThread}
        message={message}
        participants={participants}
        currentUser={currentUser}
         />
    )

    expect(renderer.toJSON()).toMatchSnapshot()
    const { root } = renderer
    root.findByType(TouchableOpacity).props.onPress()
    expect(showThread).toBeCalled()
  })
})
