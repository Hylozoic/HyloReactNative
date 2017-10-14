import 'react-native'
import React from 'react'
import ReactShallowRenderer from 'react-test-renderer/shallow'
import JoinCommunity from './JoinCommunity'

jest.mock('../Loading', () => 'Loading')
jest.mock('react-navigation', () => ({
  navigate: () => {}
}))

const defaultRequiredProps = {
  useInvitation: () => Promise.resolve(),
  goToCommunity: () => {},
  navigation: {}
}

function testPropsSetup (props = {}, required = defaultRequiredProps) {
  return {...required, ...props}
}

function shallowRender (props) {
  const renderer = new ReactShallowRenderer()
  renderer.render(<JoinCommunity {...testPropsSetup(props)} />)
  return renderer
}

it('matches last snapshot - default', () => {
  const actual = shallowRender().getRenderOutput()
  expect(actual).toMatchSnapshot()
})

// Lifecycle Methods

test('componentDidMount', () => {
  const testProps = testPropsSetup({
    useInvitation: jest.fn()
  })
  shallowRender(testProps)._instance.componentDidMount()
  expect(testProps.useInvitation).toHaveBeenCalled()
})
