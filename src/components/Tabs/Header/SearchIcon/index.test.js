import React from 'react'
import ReactShallowRenderer from 'react-test-renderer/shallow'
import SearchIcon from './index'

describe('SearchIcon', () => {
  it('renders correctly', () => {
    const renderer = new ReactShallowRenderer()
    const showSearch = jest.fn()
    renderer.render(<SearchIcon showSearch={showSearch} />)
    const actual = renderer.getRenderOutput()
    expect(actual.props.action).toBe(showSearch)
    expect(actual).toMatchSnapshot()
  })
})
