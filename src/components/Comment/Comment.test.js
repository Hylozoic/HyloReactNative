import 'react-native'
import React from 'react'
import ReactShallowRenderer from 'react-test-renderer/shallow'
import Comment, { CommentMenu } from './Comment'

it('renders correctly', () => {
  const comment = {
    id: 1,
    creator: {
      name: 'Ishamel',
      avatarUrl: 'foo.png'
    },
    text: 'tick followed tock followed tick followed tock'
  }

  const style = {
    margin: 12
  }

  const renderer = new ReactShallowRenderer()
  renderer.render(
    <Comment comment={comment} deleteComment={jest.fn()} handleReply={jest.fn()} style={style} />
  )
  const actual = renderer.getRenderOutput()

  expect(actual).toMatchSnapshot()
})

it('shows the post title when displayPostTitle is true', () => {
  const comment = {
    id: 1,
    creator: {
      name: 'Ishamel',
      avatarUrl: 'foo.png'
    },
    text: 'tick followed tock followed tick followed tock',
    post: {
      id: 23,
      title: "What's good? A long enough post title to be a bit truncated thanks"
    }
  }

  const style = {
    margin: 12
  }

  const renderer = new ReactShallowRenderer()
  renderer.render(
    <Comment comment={comment} style={style} handleReply={jest.fn()} displayPostTitle />
  )
  const actual = renderer.getRenderOutput()

  expect(actual).toMatchSnapshot()
})

describe('commentMenu', () => {
  it('renders correctly', () => {
    const menuItems = {
      deleteComment: {
        label: 'Delete Comment',
        action: jest.fn()
      }
    }
    const renderer = new ReactShallowRenderer()
    renderer.render(
      <CommentMenu menuItems={menuItems} />
    )
    const actual = renderer.getRenderOutput()

    expect(actual).toMatchSnapshot()
  })

  it('returns null when menuItems is not empty', () => {
    const renderer = new ReactShallowRenderer()
    renderer.render(<CommentMenu menuItems={{}} />)
    const actual = renderer.getRenderOutput()

    expect(actual).toBeNull()
  })
})
