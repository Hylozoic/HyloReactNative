import GoogleLoginButton from './GoogleLoginButton'
import ReactTestRenderer from 'react-test-renderer'
import React from 'react'

const successMocks = {
  GoogleSignin: {
    hasPlayServices: jest.fn(),
    signIn: jest.fn(() => Promise.resolve()),
    getTokens: jest.fn(() => ({ accessToken: 'faketoken' })),
    configure: jest.fn()
  }
}

const errorMocks = {
  GoogleSignin: {
    hasPlayServices: jest.fn(),
    signIn: jest.fn(() => Promise.reject('an error')),
    configure: jest.fn()
  }
}

it('handles a tap', () => {
  const onLoginFinished = jest.fn()

  const node = ReactTestRenderer.create(
    <GoogleLoginButton
      mocks={successMocks}
      onLoginFinished={onLoginFinished}
    />)

  const instance = node.getInstance()
  return instance.signIn().then(() => {
    expect(onLoginFinished).toHaveBeenCalled()
  })
})

it('handles an error', () => {
  const onLoginFinished = jest.fn()
  const createErrorNotification = jest.fn()
  const node = ReactTestRenderer.create(
    <GoogleLoginButton
      mocks={errorMocks}
      onLoginFinished={onLoginFinished}
      createErrorNotification={createErrorNotification}
    />)

  const instance = node.getInstance()
  return instance.signIn().then(() => {
    expect(createErrorNotification).toBeCalledWith('COULD NOT SIGN IN WITH YOUR GOOGLE ACCOUNT')
  })
})
