import 'react-native'
import React from 'react'
import TestRenderer from 'react-test-renderer'
import { Members } from './Members'

it('renders correctly with no community', () => {
  const members = [
    {id: '1', name: 'Foo Lane', location: 'here', bio: 'Hello!', avatarUrl: 'foo.gif'},
    {id: '2', name: 'Bar Jones', location: 'there', bio: 'Not a stork', avatarUrl: 'bar.png'},
    {id: '3', name: 'Baz Chu', bio: 'Could be', avatarUrl: 'baz.png'},
    {id: '4', name: 'Bonk Gundsdottir', avatarUrl: 'bonk.jpg'}
  ]
  const renderer = TestRenderer.create(<Members members={members} />)
  expect(renderer).toMatchSnapshot()
})
