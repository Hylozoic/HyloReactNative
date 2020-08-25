import FbLoginButton from './FbLoginButton'
import ReactTestRenderer from 'react-test-renderer'
import React from 'react'

const mocks = {
  LoginManager: {
    logInWithPermissions: jest.fn(() => Promise.resolve({foo: 'bar'}))
  },
  AccessToken: {
    getCurrentAccessToken: jest.fn(() => Promise.resolve({
      accessToken: {
        toString: () => 'token'
      }
    }))
  }
}

const errorMocks = {
  ...mocks,
  LoginManager: {
    logInWithPermissions: jest.fn(() => Promise.reject())
  }
}

it('handles a tap', () => {
  const onLoginFinished = jest.fn()

  const node = ReactTestRenderer.create(
    <FbLoginButton mocks={mocks} onLoginFinished={onLoginFinished} />)

  const instance = node.getInstance()
  jest.spyOn(instance, 'handleResult')

  return instance.signIn().then(() => {
    expect(instance.handleResult).toBeCalledWith(null, {foo: 'bar'})
    expect(mocks.AccessToken.getCurrentAccessToken).toBeCalled()
    expect(onLoginFinished).toBeCalledWith('token')
  })
})


it('calls createErrorNotification on error', () => {
  const onLoginFinished = jest.fn()
  const createErrorNotification = jest.fn()
  const node = ReactTestRenderer.create(
    <FbLoginButton
      mocks={errorMocks}
      onLoginFinished={onLoginFinished}
      createErrorNotification={createErrorNotification}
    />)

  const instance = node.getInstance()

  return instance.signIn().then(() => {
    expect(createErrorNotification).toBeCalledWith('COULD NOT SIGN IN WITH YOUR FACEBOOK ACCOUNT')
  })
})
