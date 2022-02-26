import 'react-native'
import React from 'react'
import ReactShallowRenderer from 'react-test-renderer/shallow'
import TestRenderer from 'react-test-renderer'
import Thread from './Thread'
import { Provider } from 'react-redux'
import { getEmptyState } from 'store/reducers/resetStore'
import { createMockStore } from 'util/testing'

// jest.mock('components/MessageInput', () => 'MessageInput')

// jest.mock('components/SocketSubscriber', () => {
//   const React = require('react')
//   class SocketSubscriber extends React.Component {
//     render () {
//       return React.createElement('SocketSubscriber', this.props, this.props.children)
//     }
//   }
//   return SocketSubscriber
// })

// jest.mock('components/SocketSubscriber', () => {})

// jest.mock('components/PeopleTyping', () => {})

jest.mock('util/websockets', () => {
  const socket = {
    post: jest.fn(),
    on: jest.fn()
  }

  return {
    getSocket: () => Promise.resolve(socket),
    socketUrl: path => 'sockethost' + path
  }
})

describe('Thread', () => {
  let props

  beforeEach(() => {
    jest.useFakeTimers()
    props = {
      id: '1',
      createMessage: () => {},
      currentUserId: '1',
      fetchMessages: () => {},
      isConnected: true,
      setNavParams: () => {},

      // Remember: _descending_ order, new to old...
      messages: [
        {
          id: '56025',
          createdAt: 'Mon Aug 14 2017 18:58:37 GMT+1200 (NZST)',
          text: 'Flargle argle',
          creator: { id: '86894', name: 'Yup', avatarUrl: 'http://yup.com' }
        },
        {
          id: '56024',
          createdAt: 'Mon Aug 14 2017 17:27:42 GMT+1200 (NZST)',
          text: 'Argle bargle',
          creator: { id: '86895', name: 'Nope', avatarUrl: 'http://nope.com' }
        },
        {
          id: '56023',
          createdAt: 'Mon Aug 14 2017 15:24:36 GMT+1200 (NZST)',
          text: 'Bargle wargle',
          creator: { id: '86896', name: 'Maybe', avatarUrl: 'http://maybe.com' }
        }
      ],
      reconnectFetchMessages: () => {},
      setTitle: () => {},
      updateThreadReadTime: () => {}
    }
  })

  it('matches the last snapshot', () => {
    const renderer = new ReactShallowRenderer()
    renderer.render(<Thread {...props} />)
    expect(renderer.getRenderOutput()).toMatchSnapshot()
  })

  describe('when at bottom', () => {
    let root

    beforeEach(() => {
      const store = createMockStore(getEmptyState())
      root = TestRenderer.create(
        <Provider store={store}>
          <Thread {...props} />
        </Provider>
      ).root.children[0]
    })

    it('scrolls on new message from anyone', () => {
      const nextProps = {
        ...props,
        messages: [
          {
            id: '56022',
            creator: { id: '86897', name: 'NotMe' }
          },
          ...props.messages
        ]
      }
      root.instance.UNSAFE_componentWillUpdate(nextProps)
      expect(root.instance.shouldScroll).toBe(true)
    })
  })

  describe('when not at bottom', () => {
    let root

    beforeEach(() => {
      const state = getEmptyState()
      root = TestRenderer.create(
        <Provider store={createMockStore(state)}>
          <Thread {...props} />
        </Provider>
      ).root.children[0]
      root.instance.atBottom = () => false
    })

    it('does not scroll if additional messages are old (infinite scroll)', async () => {
      const nextProps = {
        ...props,
        messages: [
          ...props.messages,
          {
            id: '56022',
            creator: { id: '1', name: 'Me' }
          }
        ]
      }
      await root.instance.UNSAFE_componentWillUpdate(nextProps)
      expect(root.instance.shouldScroll).toBe(false)
    })

    it('does not scroll on single new message from another user', async () => {
      const nextProps = {
        ...props,
        messages: [
          {
            id: '56026',
            creator: { id: '86897', name: 'NotMe' }
          },
          ...props.messages
        ]
      }
      await root.instance.UNSAFE_componentWillUpdate(nextProps)
      expect(root.instance.shouldScroll).toBe(false)
    })

    it('scrolls on single new message from current user', async () => {
      const nextProps = {
        ...props,
        messages: [
          {
            id: '56022',
            creator: { id: '1', name: 'Me' }
          },
          ...props.messages
        ]
      }
      await root.instance.UNSAFE_componentWillUpdate(nextProps)
      expect(root.instance.shouldScroll).toBe(true)
    })
  })

  describe('componentDidUpdate', () => {
    it('calls props.updateThreadReadTime when id changes', () => {
      const prevPropsSameId = {
        ...props,
        messages: []
      }
      const prevPropsDifferentId = {
        ...props,
        id: '2',
        messages: []
      }
      const store = createMockStore(getEmptyState())
      const instance = TestRenderer.create(
        <Provider store={store}>
          <Thread {...props} />
        </Provider>
      ).root.children[0].instance
      jest.spyOn(instance, 'markAsRead')

      instance.componentDidUpdate(prevPropsSameId)
      expect(instance.markAsRead).not.toHaveBeenCalled()
      instance.componentDidUpdate(prevPropsDifferentId)
      expect(instance.markAsRead).toHaveBeenCalled()
    })
  })
})
