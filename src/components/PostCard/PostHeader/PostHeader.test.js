import 'react-native'
import React from 'react'
import ReactShallowRenderer from 'react-test-renderer/shallow'
import PostHeader, { PostMenu, PostLabel } from './PostHeader'

it('renders correctly with all=true, and no group or user', () => {
  const creator = {
    id: 24,
    name: 'Zeus',
    tagline: 'Go!',
    avatarUrl: 'foo.png'
  }
  const renderer = new ReactShallowRenderer()
  renderer.render(<PostHeader
    creator={creator}
    deletePost={() => {}}
    postId={22}
    canFlag
    pinned
    removePost={() => {}}
    topics={[{ name: 'topic1' }, { name: 'topic2' }]}
    editPost={() => {}}
    pinPost={() => {}}
    date={new Date(new Date().getTime() - 60000 * 10)}
                  />)
  const actual = renderer.getRenderOutput()

  expect(actual).toMatchSnapshot()
})

it('renders correctly when showGroup is true', () => {
  const creator = {
    name: 'Zeus',
    tagline: 'Go!',
    avatarUrl: 'foo.png'
  }
  const groups = [
    {
      id: 1,
      name: 'Olympus'
    }
  ]
  const renderer = new ReactShallowRenderer()
  renderer.render(<PostHeader
    creator={creator}
    groups={groups}
    showGroup
    pinned={false}
    postId={20}
    slug='olympus'
    canFlag
    deletePost={() => {}}
    editPost={() => {}}
    pinPost={() => {}}
    date={new Date(new Date().getTime() - 60000 * 10)}
                  />)
  const actual = renderer.getRenderOutput()

  expect(actual).toMatchSnapshot()
})

it('renders correctly with no flagging', () => {
  const creator = {
    name: 'Zeus',
    tagline: 'Go!',
    avatarUrl: 'foo.png'
  }
  const groups = [
    {
      id: 1,
      name: 'Olympus'
    }
  ]
  const renderer = new ReactShallowRenderer()
  renderer.render(<PostHeader
    creator={creator}
    groups={groups}
    showGroup
    postId={20}
    slug='olympus'
    canFlag={false}
    pinned
    deletePost={() => {}}
    editPost={() => {}}
    pinPost={() => {}}
    date={new Date(new Date().getTime() - 60000 * 10)}
                  />)
  const actual = renderer.getRenderOutput()

  expect(actual).toMatchSnapshot()
})

describe('PostLabel', () => {
  it('renders', () => {
    const renderer = new ReactShallowRenderer()
    renderer.render(<PostLabel type='request' />)

    const actual = renderer.getRenderOutput()

    expect(actual).toMatchSnapshot()
  })
})

describe('PostMenu', () => {
  it('returns null when no actions', () => {
    const renderer = new ReactShallowRenderer()
    renderer.render(<PostMenu />)
    const actual = renderer.getRenderOutput()

    expect(actual).toMatchSnapshot()
  })

  it('returns a popupmenu when flagging allowed', () => {
    const renderer = new ReactShallowRenderer()
    renderer.render(<PostMenu flagPost={() => { }} />)
    const actual = renderer.getRenderOutput()

    expect(actual).toMatchSnapshot()
  })

  it('returns a popupmenu when deleting allowed', () => {
    const renderer = new ReactShallowRenderer()
    renderer.render(<PostMenu deletePost={() => { }} />)
    const actual = renderer.getRenderOutput()

    expect(actual).toMatchSnapshot()
  })

  it('returns a popupmenu when editing allowed', () => {
    const renderer = new ReactShallowRenderer()
    renderer.render(<PostMenu editPost={() => { }} />)
    const actual = renderer.getRenderOutput()

    expect(actual).toMatchSnapshot()
  })

  it('returns a popupmenu when removePost', () => {
    const renderer = new ReactShallowRenderer()
    renderer.render(<PostMenu removePost={() => { }} />)
    const actual = renderer.getRenderOutput()

    expect(actual).toMatchSnapshot()
  })
})
