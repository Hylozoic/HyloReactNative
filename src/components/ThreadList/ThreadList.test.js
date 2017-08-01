import 'react-native'
import React from 'react'
import ReactShallowRenderer from 'react-test-renderer/shallow'

import ThreadList, { MessageRow } from './ThreadList'

describe('ThreadList', () => {
  it('renders correctly', () => {
    const renderer = new ReactShallowRenderer()
    const threads = [{id: 1}]
    renderer.render(<ThreadList threads={threads} />)
    const actual = renderer.getRenderOutput()

    expect(actual).toMatchSnapshot()
  })
  it('handles pending correctly without threads', () => {
    const renderer = new ReactShallowRenderer()
    const threads = []
    const pending = true
    renderer.render(<ThreadList threads={threads} pending={pending} />)
    const actual = renderer.getRenderOutput()

    expect(actual).toMatchSnapshot()
  })
  it('handles pending correctly with threads', () => {
    const renderer = new ReactShallowRenderer()
    const threads = {id: 1}
    const pending = true
    renderer.render(<ThreadList threads={threads} pending={pending} />)
    const actual = renderer.getRenderOutput()

    expect(actual).toMatchSnapshot()
  })
  it('handles when there are no threads correctly', () => {
    const renderer = new ReactShallowRenderer()
    const threads = []
    const pending = false
    renderer.render(<ThreadList threads={threads} pending={pending} />)
    const actual = renderer.getRenderOutput()

    expect(actual).toMatchSnapshot()
  })
})

describe('MessageRow', () => {
  it('renders correctly', () => {
    const message = [{id: 1}]
    const participants = [{id: 2}]
    const renderer = new ReactShallowRenderer()
    renderer.render(<MessageRow
      message={message}
      participants={participants} />)
    const actual = renderer.getRenderOutput()
    expect(actual).toMatchSnapshot()
  })
})
