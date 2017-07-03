import { Text } from 'react-native'
import React from 'react'
import ReactShallowRenderer from 'react-test-renderer/shallow'
import Comments, { ShowMore } from './Comments'

describe('Comments', () => {
  it('renders correctly', () => {
    const header = <Text>Some React Code</Text>
    const comments = [
      {id: 1},
      {id: 2},
      {id: 3}
    ]

    const renderer = new ReactShallowRenderer()
    renderer.render(<Comments
      comments={comments}
      header={header}
      total={17}
      fetchComments={() => {}}
      hasMore
      pending />)
    const actual = renderer.getRenderOutput()

    expect(actual).toMatchSnapshot()
  })
})

describe('ShowMore', () => {
  it('renders correctly', () => {
    const renderer = new ReactShallowRenderer()

    renderer.render(<ShowMore
      total={17}
      fetchComments={() => {}}
      hasMore />)
    const actual = renderer.getRenderOutput()

    expect(actual).toMatchSnapshot()
  })
})
