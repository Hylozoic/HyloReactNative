import React from 'react'
import TestRenderer from 'react-test-renderer'
import { TestRoot } from 'util/testing'
import MockedScreen from 'util/testing/MockedScreen'
import Members from './Members'

it('renders correctly with no group (all groups default)', () => {
  const members = [
    { id: '1', name: 'Foo Lane', location: 'here', bio: 'Hello!', avatarUrl: 'foo.gif' },
    { id: '2', name: 'Bar Jones', location: 'there', bio: 'Not a stork', avatarUrl: 'bar.png' },
    { id: '3', name: 'Baz Chu', bio: 'Could be', avatarUrl: 'baz.png' },
    { id: '4', name: 'Bonk Gundsdottir', avatarUrl: 'bonk.jpg' },
    { id: '5', avatarUrl: 'woof.png' }
  ]
  const { toJSON } = TestRenderer.create(
    <TestRoot>
      <MockedScreen>
        {screenProps => (
          <Members members={members} {...screenProps} />
        )}
      </MockedScreen>
    </TestRoot>
  )

  expect(toJSON()).toMatchSnapshot()
})

it('renders with invite button when a moderator', () => {
  const members = [
    { id: '1', name: 'Foo Lane', location: 'here', bio: 'Hello!', avatarUrl: 'foo.gif' },
    { id: '2', name: 'Bar Jones', location: 'there', bio: 'Not a stork', avatarUrl: 'bar.png' },
    { id: '3', name: 'Baz Chu', bio: 'Could be', avatarUrl: 'baz.png' },
    { id: '4', name: 'Bonk Gundsdottir', avatarUrl: 'bonk.jpg' },
    { id: '5', avatarUrl: 'woof.png' }
  ]
  const { toJSON } = TestRenderer.create(
    <TestRoot>
      <MockedScreen>
        {screenProps => (
          <Members canModerate group={{ allowGroupInvites: true }} members={members} {...screenProps} />
        )}
      </MockedScreen>
    </TestRoot>
  )

  expect(toJSON()).toMatchSnapshot()
})
