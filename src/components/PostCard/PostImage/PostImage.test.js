import React from 'react'
import PostImage from './PostImage'
import TestRenderer from 'react-test-renderer'

it('returns null if there is no imageUrl', () => {
  const renderer = TestRenderer.create(
    <PostImage />
  )
  expect(renderer.toJSON()).toBe(null)
})

it('returns SpaceFillingImage', () => {
  const renderer = TestRenderer.create(
    <PostImage imageUrl='http://foo.com/bar.png' />
  )
  expect(renderer.toJSON()).toMatchSnapshot()
})
