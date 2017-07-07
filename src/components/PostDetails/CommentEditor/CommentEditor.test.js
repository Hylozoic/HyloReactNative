import React from 'react'
import ReactShallowRenderer from 'react-test-renderer/shallow'
// import CommentEditor from './CommentEditor'
// This is currently broken because of an issue with react-native and jest

it.skip('renders correctly', () => {
  const renderer = new ReactShallowRenderer()
  renderer.render(<CommentEditor
    content={'lalala'} />)
  const actual = renderer.getRenderOutput()

  expect(actual).toMatchSnapshot()
})
