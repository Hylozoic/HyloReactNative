import React from 'react'
import ReactShallowRenderer from 'react-test-renderer/shallow'
import TestRenderer from 'react-test-renderer'
import ForgotPassword, { FormError } from './ForgotPassword'

jest.mock('react-native-device-info')

function defaultProps (props) {
  return {
    error: '',
    resetPassword: jest.fn(),
    goToLogin: jest.fn(),
    ...props
  }
}

describe('ForgotPassword', () => {
  it('renders correctly', () => {
    const renderer = new ReactShallowRenderer()
    renderer.render(<ForgotPassword {...defaultProps()} />)
    const actual = renderer.getRenderOutput()
    expect(actual).toMatchSnapshot()
  })

  it('calls login successfully', async () => {
    const props = defaultProps()
    const instance = TestRenderer.create(
      <ForgotPassword {...props} />
    ).root.instance

    await instance.submit()
    expect(props.goToLogin).toHaveBeenCalled()
  })

  it('calls validateEmail successfully', () => {
    const validEmail = 'test@email.com'
    const invalidEmail = 'test'
    const instance = TestRenderer.create(
      <ForgotPassword {...defaultProps()} />
    ).root.instance

    instance.validateEmail(validEmail)
    expect(instance.state.emailIsValid).toBeTruthy()

    instance.validateEmail(invalidEmail)
    expect(instance.state.emailIsValid).toBeFalsy()
  })

  it('calls setInput successfully', () => {
    const emailKey = 'email'
    const passwordKey = 'password'
    const email = 'test@email.com'
    const password = 'pass'
    const instance = TestRenderer.create(
      <ForgotPassword {...defaultProps()} />
    ).root.instance

    instance.setInput(emailKey, email)
    expect(instance.state.email).toEqual(email)
    expect(instance.state.emailIsValid).toBeTruthy()

    instance.setInput(passwordKey, password)
    expect(instance.state.password).toEqual(password)
  })
})

describe('FormError', () => {
  it('renders correctly', () => {
    const message = 'email error'
    const position = 'top'
    const renderer = new ReactShallowRenderer()
    renderer.render(<FormError message={message} position={position} />)
    const actual = renderer.getRenderOutput()
    expect(actual).toMatchSnapshot()
  })
})
