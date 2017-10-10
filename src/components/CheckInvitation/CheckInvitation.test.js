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
  pending: null,
  isValidInvite: null,
  checkInvitation: () => Promise.resolve(),
  navToSignup: () => {},
  navToInviteExpired: () => {}
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
    checkInvitation: jest.fn(() => Promise.reject(new Error('erroranything'))),
    navToSignup: jest.fn()
  })
  // const instance = ReactTestRenderer.create(<CheckInvitation {...testProps} />).getInstance()
  return shallowRender(testProps)._instance.componentDidMount()
  .then(() => {
    expect(testProps.checkInvitation).toHaveBeenCalled()
    return expect(testProps.navToSignup).toHaveBeenCalled()
  })
})

test('componentWillUpdate', () => {
  const testProps = testPropsSetup({
    pending: false,
    isValidInvite: true
  })
  const instance = ReactTestRenderer.create(<CheckInvitation {...testPropsSetup()} />).getInstance()
  instance._handleResult = jest.fn()
  instance.componentWillUpdate(testProps)
  expect(instance._handleResult).toHaveBeenCalledWith(testProps)
})

test('_handleResult', () => {
  const testProps = testPropsSetup({
    isValidInvite: true,
    navToSignup: jest.fn(),
    navToInviteExpired: jest.fn()
  })
  const instance = ReactTestRenderer.create(<CheckInvitation {...testPropsSetup()} />).getInstance()
  instance._handleResult(testProps)
  expect(testProps.navToSignup).toHaveBeenCalled()
})
