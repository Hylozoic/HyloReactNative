import React from 'react'
import ReactShallowRenderer from 'react-test-renderer/shallow'
import ThreadCard, { threadNames, ThreadAvatars } from './ThreadCard'

it('renders correctly', () => {
  const message = {
    text: 'Hey, just checking in. Test, test, test.'
  }
  const renderer = new ReactShallowRenderer()
  renderer.render(<ThreadCard message={message} />)
  const actual = renderer.getRenderOutput()

  expect(actual).toMatchSnapshot()
})

describe('handles threadNames correctly', () => {
  it('handles when 1 name is passed', () => {
    const names = ['One name']
    expect(threadNames(names)).toBe('One name')
  })
  it('handles when multiple names are passed', () => {
    const names = ['One name', 'Second Name', 'Third Name']
    expect(threadNames(names)).toBe('One name and 2 others')
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
