import 'react-native'
import React from 'react'
import ReactShallowRenderer from 'react-test-renderer/shallow'
import ReactTestRenderer from 'react-test-renderer'
import Thread from './Thread'

jest.mock('react-native-device-info')

describe('Thread', () => {
  let props

  beforeEach(() => {
    props = {
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
    renderer.render(<Thread { ...props } />)
    expect(renderer.getRenderOutput()).toMatchSnapshot()
  })

  describe('when at bottom', () => {
    let root

    beforeEach(() => {
      root = ReactTestRenderer.create(<Thread { ...props } />).root
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
      root.instance.componentWillUpdate(nextProps)
      expect(root.instance.shouldScroll).toBe(true)
    })
  })

  describe('when not at bottom', () => {
    let root

    beforeEach(() => {
      root = ReactTestRenderer.create(<Thread { ...props } />).root
      root.instance.atBottom = () => false
    })

    it('does not scroll if additional messages are old (infinite scroll)', () => {
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
      root.instance.componentWillUpdate(nextProps)
      expect(root.instance.shouldScroll).toBe(false)
    })

    it('does not scroll on single new message from another user', () => {
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
      root.instance.componentWillUpdate(nextProps)
      expect(root.instance.shouldScroll).toBe(false)
    })

    it('scrolls on single new message from current user', () => {
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
      root.instance.componentWillUpdate(nextProps)
      expect(root.instance.shouldScroll).toBe(true)
    })
  })
})

// Mocks get hoisted. Currently cannot get this to work with manual __mocks__
// folders and our Redux container setup... pointers welcome!
//
// Workaround for no refs in react-test-renderer, extrapolated from
// https://github.com/facebook/react-native/issues/15000#issuecomment-315250887
// If used more than once, this could be extracted to a more general location
jest.mock('FlatList', () => {
  const React = require('React')
  class FlatList extends React.Component {
    _listRef = { scrollToOffset: jest.fn() }
    scrollToOffset = jest.fn()

    render () {
      return React.createElement('FlatList', this.props, this.props.children)
    }
  }
  return FlatList
})

// Can actually get away with `jest.mock('../SocketSubscriber')` here, but it
// generates warnings because `undefined` isn't exactly a React component...
jest.mock('../SocketSubscriber', () => {
  const React = require('React')
  class SocketSubscriber extends React.Component {
    render () {
      return React.createElement('SocketSubscriber', this.props, this.props.children)
    }
  }
  return SocketSubscriber
})

jest.mock('../PeopleTyping', () => {
  const React = require('React')
  class PeopleTyping extends React.Component {
    render () {
      return React.createElement('PeopleTyping', this.props, this.props.children)
    }
  }
  return PeopleTyping
})

jest.mock('util/websockets', () => ({
  getSocket: Promise.resolve
}))
