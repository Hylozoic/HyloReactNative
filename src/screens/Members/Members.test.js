import 'react-native'
import React from 'react'
import TestRenderer from 'react-test-renderer'
import Members, { Banner, Member } from './Members'

it('renders correctly with no community and isAll', () => {
  const members = [
    { id: '1', name: 'Foo Lane', location: 'here', bio: 'Hello!', avatarUrl: 'foo.gif' },
    { id: '2', name: 'Bar Jones', location: 'there', bio: 'Not a stork', avatarUrl: 'bar.png' },
    { id: '3', name: 'Baz Chu', bio: 'Could be', avatarUrl: 'baz.png' },
    { id: '4', name: 'Bonk Gundsdottir', avatarUrl: 'bonk.jpg' },
    { id: '5', avatarUrl: 'woof.png' }
  ]
  const renderer = TestRenderer.create(<Members members={members} isAll />)
  expect(renderer).toMatchSnapshot()
})

it('renders with invite button when a moderator', () => {
  const members = [
    { id: '1', name: 'Foo Lane', location: 'here', bio: 'Hello!', avatarUrl: 'foo.gif' },
    { id: '2', name: 'Bar Jones', location: 'there', bio: 'Not a stork', avatarUrl: 'bar.png' },
    { id: '3', name: 'Baz Chu', bio: 'Could be', avatarUrl: 'baz.png' },
    { id: '4', name: 'Bonk Gundsdottir', avatarUrl: 'bonk.jpg' },
    { id: '5', avatarUrl: 'woof.png' }
  ]

  const renderer = TestRenderer.create(<Members canModerate members={members} isAll />)
  expect(renderer).toMatchSnapshot()
})

describe('Banner', () => {
  it('returns null if community, netowrk and all are all falsy', () => {
    expect(Banner({})).toBe(null)
  })

  it('matches snapshot when all is true', () => {
    expect(Banner({ all: true })).toMatchSnapshot()
  })

  it('matches snapshot with community', () => {
    const community = {
      name: 'Foomunity',
      bannerUrl: 'foom.png'
    }
    expect(Banner({ community })).toMatchSnapshot()
  })

  it('matches snapshot with network', () => {
    const network = {
      name: 'Foom Network',
      bannerUrl: 'foomn.png'
    }
    expect(Banner({ network })).toMatchSnapshot()
  })
})