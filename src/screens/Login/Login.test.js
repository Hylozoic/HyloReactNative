import React from 'react'
import ReactShallowRenderer from 'react-test-renderer/shallow'
import TestRenderer from 'react-test-renderer'
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

describe('Login', () => {
  it('renders correctly', () => {
    const renderer = new ReactShallowRenderer()
    renderer.render(<Login goToSignup={() => {}} />)
    const actual = renderer.getRenderOutput()
    expect(actual).toMatchSnapshot()
  })

  it('renders with pending banner', () => {
    const renderer = new ReactShallowRenderer()
    renderer.render(<Login pending />)
    const actual = renderer.getRenderOutput()
    expect(actual).toMatchSnapshot()
  })

  it('renders error message', () => {
    const errorMessage = 'password error'
    const renderer = new ReactShallowRenderer()
    renderer.render(<Login
      error={errorMessage}
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

  it('calls login successfully', () => {
    const login = jest.fn()
    const instance = TestRenderer.create(<Login
      login={login}
                                         />
    ).root.instance

    instance.login()
    expect(login).toHaveBeenCalled()
  })

  it('calls validateEmail successfully', () => {
    const validEmail = 'test@email.com'
    const invalidEmail = 'test'
    const instance = TestRenderer.create(<Login
      error=''
                                         />
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
    const instance = TestRenderer.create(<Login />
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

describe('SignupLink', () => {
  it('renders correctly', () => {
    const renderer = new ReactShallowRenderer()
    renderer.render(<SignupLink goToSignup={jest.fn()} />)
    const actual = renderer.getRenderOutput()
    expect(actual).toMatchSnapshot()
  })
})
