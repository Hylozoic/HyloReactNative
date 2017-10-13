import 'react-native'
import React from 'react'
import ReactTestRenderer from 'react-test-renderer'
import ReactShallowRenderer from 'react-test-renderer/shallow'
import CheckInvitation from './CheckInvitation'

jest.mock('../Loading', () => 'Loading')
jest.mock('react-navigation', () => ({
  reset: () => {},
  navigate: () => {}
}))

const defaultRequiredProps = {
  checkInvitation: () => Promise.resolve()
}

function testPropsSetup (props = {}, required = defaultRequiredProps) {
  return {...required, ...props}
}

function shallowRender (props) {
  const renderer = new ReactShallowRenderer()
  renderer.render(<CheckInvitation {...testPropsSetup(props)} />)
  return renderer
}

it('matches last snapshot - default', () => {
  const actual = shallowRender().getRenderOutput()
  expect(actual).toMatchSnapshot()
})

// Lifecycle Methods

test('componentDidMount', () => {
  const testProps = testPropsSetup({
    checkInvitation: jest.fn()
  })
  shallowRender(testProps)._instance.componentDidMount()
  expect(testProps.checkInvitation).toHaveBeenCalled()
})
