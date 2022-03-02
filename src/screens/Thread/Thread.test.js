import 'react-native'
import React from 'react'
import { render } from '@testing-library/react-native'
import TestRenderer from 'react-test-renderer'
import { TestRoot } from 'util/testing'
import Thread from './Thread'

jest.mock('util/websockets', () => {
  return {
    getSocket: () => Promise.resolve({
      post: jest.fn(),
      on: jest.fn(),
      off: jest.fn()
    })
  }
})

// Throws multiple render warnings that muddy tests results without this
jest.mock('components/HyloHTML', () => ({ html }) => html)

describe('Thread', () => {
  let props

  beforeEach(() => {
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
    const { toJSON } = render(
      <TestRoot>
        <Thread {...props} />
      </TestRoot>
    )
    expect(toJSON()).toMatchSnapshot()
  })

  describe('when at bottom', () => {
    it('scrolls on new message from anyone', () => {
      const root = TestRenderer.create(
        <TestRoot>
          <Thread {...props} />
        </TestRoot>
      ).root.findByType(Thread)
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
    it('does not scroll if additional messages are old (infinite scroll)', () => {
      const root = TestRenderer.create(
        <TestRoot>
          <Thread {...props} />
        </TestRoot>
      ).root.findByType(Thread)
      root.instance.atBottom = () => false

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
      root.instance.UNSAFE_componentWillUpdate(nextProps)
      expect(root.instance.shouldScroll).toBe(false)
    })

    it('does not scroll on single new message from another user', () => {
      const root = TestRenderer.create(
        <TestRoot>
          <Thread {...props} />
        </TestRoot>
      ).root.findByType(Thread)
      root.instance.atBottom = () => false
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
      root.instance.UNSAFE_componentWillUpdate(nextProps)
      expect(root.instance.shouldScroll).toBe(false)
    })

    it('scrolls on single new message from current user', () => {
      const root = TestRenderer.create(
        <TestRoot>
          <Thread {...props} />
        </TestRoot>
      ).root.findByType(Thread)
      root.instance.atBottom = () => false
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
      root.instance.UNSAFE_componentWillUpdate(nextProps)
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
      const instance = TestRenderer.create(
        <TestRoot>
          <Thread {...props} />
        </TestRoot>
      ).root.findByType(Thread).instance

      jest.spyOn(instance, 'markAsRead')
      instance.componentDidUpdate(prevPropsSameId)
      expect(instance.markAsRead).not.toHaveBeenCalled()
      instance.componentDidUpdate(prevPropsDifferentId)
      expect(instance.markAsRead).toHaveBeenCalled()
    })
  })
})
