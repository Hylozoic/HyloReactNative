import 'react-native'
import React from 'react'
import ReactShallowRenderer from 'react-test-renderer/shallow'
import PostHeader, { PostMenu, PostLabel } from './PostHeader'
import { render } from '@testing-library/react-native'
import { createInitialStateWithCurrentUser, TestRoot } from 'util/testing'

it('renders correctly with all=true, and no group or user', () => {
  const creator = {
    id: 24,
    name: 'Zeus',
    tagline: 'Go!',
    avatarUrl: 'foo.png'
  }
  const { toJSON } = render(
    <TestRoot>
      <PostHeader
        creator={creator}
        postId={22}
        pinned
        topics={[{ id: '1', name: 'topic1' }, { id: '2', name: 'topic2' }]}
        date={new Date(new Date().getTime() - 60000 * 10)}
      />
    </TestRoot>
  )
  expect(toJSON()).toMatchSnapshot()
})

it('renders correctly with a current user', () => {
  const creator = {
    id: 'current-user-id',
    name: 'Zeus',
    tagline: 'Go!',
    avatarUrl: 'foo.png'
  }
  const { toJSON } = render(
    <TestRoot state={createInitialStateWithCurrentUser()}>
      <PostHeader
        creator={creator}
        pinned={false}
        postId={20}
        date={new Date(new Date().getTime() - 60000 * 10)}
      />
    </TestRoot>
  )
  expect(toJSON()).toMatchSnapshot()
})

describe('PostLabel', () => {
  it('renders', () => {
    const renderer = new ReactShallowRenderer()
    renderer.render(<PostLabel type='request' />)

    const actual = renderer.getRenderOutput()

    expect(actual).toMatchSnapshot()
  })
})
