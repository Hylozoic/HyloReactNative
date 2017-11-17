import 'react-native'
import React from 'react'
import ReactShallowRenderer from 'react-test-renderer/shallow'
import ThreadParticipants, { ParticipantRow } from './ThreadParticipants'

describe('Thread', () => {
  it('matches the last snapshot', () => {
    const renderer = new ReactShallowRenderer()
    const props = {
      participants: [{id: 1}, {id: 2}],
      goToParticipant: () => {}
    }
    renderer.render(<ThreadParticipants {...props} />)
    expect(renderer.getRenderOutput()).toMatchSnapshot()
  })
})

describe('ParticipantRow', () => {
  it('matches the last snapshot', () => {
    const renderer = new ReactShallowRenderer()
    const props = {
      participant: {name: 'Bob', avatarUrl: 'foo.png'},
      goToParticipant: () => {}
    }
    renderer.render(<ParticipantRow {...props} />)
    expect(renderer.getRenderOutput()).toMatchSnapshot()
  })
})
