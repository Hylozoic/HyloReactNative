import 'react-native'
import React from 'react'
import ReactTestRenderer from 'react-test-renderer'
import ReactShallowRenderer from 'react-test-renderer/shallow'
import LoadingModal from './LoadingModal'

it('returns null when display is false', () => {
  const renderer = new ReactShallowRenderer()

  renderer.render(<LoadingModal />)
  const actual = renderer.getRenderOutput()

  expect(actual).toEqual(null)
})

it('matches last snapshot when visible is true', () => {
  const renderer = ReactTestRenderer.create(<LoadingModal />)
  const instance = renderer.getInstance()
  instance.setState({visible: true})
  expect(renderer.toJSON()).toMatchSnapshot()
})

describe('componentWillReceiveProps', () => {
  it('sets visible to true when display is true', () => {
    const instance = ReactTestRenderer.create(<LoadingModal />).getInstance()
    instance.componentWillReceiveProps({display: true})
    expect(instance.state.visible).toEqual(true)
  })
})
