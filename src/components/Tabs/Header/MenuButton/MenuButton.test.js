import React from 'react'
import ReactShallowRenderer from 'react-test-renderer/shallow'
import MenuButton from './MenuButton'

describe('MenuButton', () => {
  it('renders correctly', () => {
    const renderer = new ReactShallowRenderer()
    const openDrawer = jest.fn()
    renderer.render(<MenuButton openDrawer={openDrawer} />)
    const actual = renderer.getRenderOutput()
    expect(actual.props.onPress).toBe(openDrawer)
    expect(actual).toMatchSnapshot()
  })
})
