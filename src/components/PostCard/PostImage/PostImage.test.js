import React from 'react'
import PostImage from './PostImage'
import TestRenderer from 'react-test-renderer'

it('returns null if imageUrls is empty', () => {
  const renderer = TestRenderer.create(
    <PostImage imageUrls={[]} />
  )
  expect(renderer.toJSON()).toBe(null)
})

it('returns ImageBackground', () => {
  const renderer = TestRenderer.create(
    <PostImage imageUrls={['http://foo.com/bar.png']} />
  )
  expect(renderer.toJSON()).toMatchSnapshot()
})

it('renders multiple images', () => {
  const renderer = TestRenderer.create(
    <PostImage imageUrls={[
      'http://foo.com/bar.png',
      'http://foo.com/baz.png',
      'http://foo.com/quz.png',
      'http://foo.com/qux.png'
    ]} />
  )
  expect(renderer.toJSON()).toMatchSnapshot()
})

it('renders multiple images that can be tapped to open in browser', () => {
  const renderer = TestRenderer.create(
    <PostImage linked imageUrls={[
      'http://foo.com/bar.png',
      'http://foo.com/baz.png',
      'http://foo.com/quz.png',
      'http://foo.com/qux.png'
    ]} />
  )
  expect(renderer.toJSON()).toMatchSnapshot()
})
