import 'react-native'
import React from 'react'
import ReactShallowRenderer from 'react-test-renderer/shallow'
import { Details } from './PostEditor'

describe('Details', () => {
  it('matches the last snapshot with details', () => {
    const renderer = new ReactShallowRenderer()
    const details = 'interesting info'
    renderer.render(<Details details={details} />)
    expect(renderer.getRenderOutput()).toMatchSnapshot()
  })
  it('matches the last snapshot without details', () => {
    const renderer = new ReactShallowRenderer()
    const details = null
    const placeholder = 'placeholder'
    renderer.render(<Details details={details} detailsPlaceholder={placeholder} />)
    expect(renderer.getRenderOutput()).toMatchSnapshot()
  })
})
