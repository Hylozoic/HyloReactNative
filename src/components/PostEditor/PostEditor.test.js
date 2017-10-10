import React from 'react'
import ReactShallowRenderer from 'react-test-renderer/shallow'
// import TestRenderer from 'react-test-renderer'
import PostEditor, { SectionLabel, TypeButton } from './PostEditor'

describe('PostEditor', () => {
  it('renders a new editor correctly', () => {
    const renderer = new ReactShallowRenderer()
    renderer.render(<PostEditor
      editDetails={jest.fn()}
    />)
    const actual = renderer.getRenderOutput()
    expect(actual).toMatchSnapshot()
  })
})

describe('SectionLabel', () => {
  it('renders correctly', () => {
    const renderer = new ReactShallowRenderer()
    renderer.render(<SectionLabel>Label</SectionLabel>)
    const actual = renderer.getRenderOutput()
    expect(actual).toMatchSnapshot()
  })
})

describe('TypeButton', () => {
  it('renders correctly', () => {
    const renderer = new ReactShallowRenderer()
    const type = 'discussion'
    renderer.render(<TypeButton
      type={type}
      key={type}
      onPress={jest.fn()}
    />)
    const actual = renderer.getRenderOutput()
    expect(actual).toMatchSnapshot()
  })
})
