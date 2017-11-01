import 'react-native'
import React from 'react'
import ReactShallowRenderer from 'react-test-renderer/shallow'
import Comment, {CommentMenu} from './Comment'

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
  renderer.render(<Comment
    comment={comment}
    deleteComment={jest.fn()}
    style={style} />)
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
  renderer.render(<Comment
    comment={comment}
    style={style}
    displayPostTitle />)
  const actual = renderer.getRenderOutput()

  expect(actual).toMatchSnapshot()
})

describe('commentMenu', () => {
  it('renders correctly', () => {
    const deleteComment = jest.fn()
    const renderer = new ReactShallowRenderer()
    renderer.render(<CommentMenu
      deleteComment={deleteComment} />)
    const actual = renderer.getRenderOutput()

    expect(actual).toMatchSnapshot()
  })

  it('returns null when deleteComment and removeComment isnt defined', () => {
    const renderer = new ReactShallowRenderer()
    renderer.render(<CommentMenu />)
    const actual = renderer.getRenderOutput()

    expect(actual).toBeNull()
  })

  it('returns removeComment', () => {
    const renderer = new ReactShallowRenderer()
    renderer.render(<CommentMenu remoeComment={jest.fn()} />)
    const actual = renderer.getRenderOutput()

    expect(actual).toBeNull()
  })
})
