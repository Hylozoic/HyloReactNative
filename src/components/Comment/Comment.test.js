import 'react-native'
import React from 'react'
import ReactShallowRenderer from 'react-test-renderer/shallow'
import Comment from './Comment'

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
    style={style} />)
  const actual = renderer.getRenderOutput()

  expect(actual).toMatchSnapshot()
})
