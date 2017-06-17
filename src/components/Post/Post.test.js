import 'react-native'
import React from 'react'
import renderer from 'react-test-renderer'
import Post from './index'

it('renders a Post', () => {
  const post = {
    title: 'Wombat'
  }
  const actual = renderer.create(<Post post={post} />)
  expect(actual).toMatchSnapshot()
})
