import React from 'react'
import ReactShallowRenderer from 'react-test-renderer/shallow'
import { JoinProjectButton } from './PostCardForDetails'

describe('JoinProjectButton', () => {
  it('renders as expected', () => {
    const renderer = new ReactShallowRenderer()
    renderer.render(
      <JoinProjectButton onPress={() => {}} />
    )
    const actual = renderer.getRenderOutput()
    expect(actual).toMatchSnapshot()
  })

  it('renders as expected when leaving', () => {
    const renderer = new ReactShallowRenderer()
    renderer.render(
      <JoinProjectButton onPress={() => {}} leaving />
    )
    const actual = renderer.getRenderOutput()
    expect(actual).toMatchSnapshot()
  })
})
