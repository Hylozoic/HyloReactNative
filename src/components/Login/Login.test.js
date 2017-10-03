import 'react-native'
import React from 'react'
import ReactShallowRenderer from 'react-test-renderer/shallow'
import Login from './Login'

jest.mock('react-native-google-signin', () => {})

describe('Login', () => {
  it('renders Login correctly', () => {
    const renderer = new ReactShallowRenderer()
    renderer.render(<Login goToSignup={() => {}} />)
    const actual = renderer.getRenderOutput()
    expect(actual).toMatchSnapshot()
  })

  it('renders with pending banner', () => {
    const renderer = new ReactShallowRenderer()
    renderer.render(<Login
      pending
    />)
    const actual = renderer.getRenderOutput()
    expect(actual).toMatchSnapshot()
  })

  it('renders with email error', () => {
    const errorMessage = 'email error'
    const renderer = new ReactShallowRenderer()
    renderer.render(<Login
      error={errorMessage}
      emailError
    />)
    const actual = renderer.getRenderOutput()
    expect(actual).toMatchSnapshot()
  })

  it('renders with password error', () => {
    const errorMessage = 'password error'
    const renderer = new ReactShallowRenderer()
    renderer.render(<Login
      error={errorMessage}
      passwordError
    />)
    const actual = renderer.getRenderOutput()
    expect(actual).toMatchSnapshot()
  })

  it('renders with no network connection error', () => {
    const renderer = new ReactShallowRenderer()
    renderer.render(<Login
      isConnected={false}
    />)
    const actual = renderer.getRenderOutput()
    expect(actual).toMatchSnapshot()
  })
})
