import React from 'react'
import ReactShallowRenderer from 'react-test-renderer/shallow'
import ThreadCard, { lastMessageCreator, ThreadAvatars } from './index'

it('renders correctly', () => {
  const message = {
    text: 'Hey, just checking in. Test, test, test.',
    '_fields': {
      creator: 1
    }
  }
  const currentUser = {id: 1, avatarUrl: 'fred.png'}

  const renderer = new ReactShallowRenderer()
  renderer.render(<ThreadCard message={message} isLast currentUser={currentUser} />)
  const actual = renderer.getRenderOutput()

  expect(actual).toMatchSnapshot()
})

describe('handles lastMessageCreator correctly', () => {
  it('handles when the current user created the message', () => {
    const currentUser = {
      id: 1
    }
    const message = {
      '_fields': {
        creator: 1
      }
    }
    expect(lastMessageCreator(message, currentUser, [])).toBe('You:')
  })
  it('handles when a different user created the message', () => {
    const name = 'name'
    const currentUser = {
      id: 1
    }
    const message = {
      '_fields': {
        creator: 2
      }
    }
    const participants = [
      {
        id: 2,
        name: name
      }
    ]
    expect(lastMessageCreator(message, currentUser, participants)).toBe(name)
  })
  it('handles when there are 2 participants and a different user created the message', () => {
    const currentUser = {
      id: 1
    }
    const message = {
      '_fields': {
        creator: 2
      }
    }
    const participants = [
      {
        id: 2,
        name: 'name1'
      },
      {
        id: 2,
        name: 'name2'
      }
    ]
    expect(lastMessageCreator(message, currentUser, participants)).toBe('')
  })
})

describe('handles ThreadAvatars correctly', () => {
  it('handles when there is one participant', () => {
    const avatarUrls = ['http://avatar.url']
    expect(ThreadAvatars({avatarUrls})).toMatchSnapshot()
  })
  it('handles when there are two participants', () => {
    const avatarUrls = [
      'http://avatar.url',
      'http://avatar.url'
    ]
    expect(ThreadAvatars({avatarUrls})).toMatchSnapshot()
  })
  it('handles when there are three participants', () => {
    const avatarUrls = [
      'http://avatar.url',
      'http://avatar.url',
      'http://avatar.url'
    ]
    expect(ThreadAvatars({avatarUrls})).toMatchSnapshot()
  })
  it('handles when there are more than three participants', () => {
    const avatarUrls = [
      'http://avatar.url',
      'http://avatar.url',
      'http://avatar.url',
      'http://avatar.url'
    ]
    expect(ThreadAvatars({avatarUrls})).toMatchSnapshot()
  })
})
