import 'react-native'
import React from 'react'
import ReactShallowRenderer from 'react-test-renderer/shallow'
import PostRow from './PostRow'

describe('PostRow', () => {
  it('renders correctly', () => {
    const post = {
      id: 1
    }
    const renderer = new ReactShallowRenderer()
    renderer.render(<PostRow
      post={post}
      navigate={() => {}}
      goToGroup={() => {}}
                    />)
    const actual = renderer.getRenderOutput()

    expect(actual).toMatchSnapshot()
  })
})
