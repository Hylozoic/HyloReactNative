import React from 'react'
import ReactShallowRenderer from 'react-test-renderer/shallow'
import Login, { FormError, SignupLink } from './Login'

jest.mock('util/platform', () => ({ isIOS: false }))
jest.mock('@react-native-google-signin/google-signin', () => ({
  GoogleSignin: {
    hasPlayServices: jest.fn(),
    signIn: jest.fn(() => Promise.resolve()),
    getTokens: jest.fn(() => ({ accessToken: 'faketoken' })),
    configure: jest.fn()
  }
}))
jest.mock('react-native-fbsdk-next', () => ({
  LoginManager: {
    logInWithReadPermissions: jest.fn()
  },
  AccessToken: {
    getCurrentAccessToken: jest.fn()
  }
}))

describe('FormError', () => {
  it('renders correctly', () => {
    const message = 'email error'
    const renderer = new ReactShallowRenderer()
    renderer.render(<FormError>{message}</FormError>)
    const actual = renderer.getRenderOutput()
    expect(actual).toMatchSnapshot()
  })
})

describe('SignupLink', () => {
  it('renders correctly', () => {
    const renderer = new ReactShallowRenderer()
    renderer.render(<SignupLink goToSignup={jest.fn()} />)
    const actual = renderer.getRenderOutput()
    expect(actual).toMatchSnapshot()
  })
})
