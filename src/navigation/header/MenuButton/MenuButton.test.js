import React from 'react'
import ReactShallowRenderer from 'react-test-renderer/shallow'
import MenuButton from './MenuButton'

describe('MenuButton', () => {
  it('renders correctly', () => {
    const renderer = new ReactShallowRenderer()
    const props = {
      navigation: {
        openDrawer: jest.fn(),
        goBack: jest.fn()
      }
    }
    renderer.render(<MenuButton {...props} />)
    const actual = renderer.getRenderOutput()
    expect(actual).toMatchSnapshot()
  })
})
