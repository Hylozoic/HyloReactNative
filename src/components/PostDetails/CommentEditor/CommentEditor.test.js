import React from 'react'
import ReactShallowRenderer from 'react-test-renderer/shallow'
import CommentEditor from './CommentEditor'
// This is currently broken because of an issue with react-native and jest

it('renders correctly', () => {
  const renderer = new ReactShallowRenderer()
  const navigation = {
    state: {
      params: {
        communityId: 1
      }
    }
  }
  renderer.render(<CommentEditor
    content={'lalala'}
    navigation={navigation}
  />)
  const actual = renderer.getRenderOutput()

  expect(actual).toMatchSnapshot()
})
