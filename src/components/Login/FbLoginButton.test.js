import FbLoginButton from './FbLoginButton'
import ReactTestRenderer from 'react-test-renderer'
import React from 'react'

const mocks = {
  LoginManager: {
    logInWithReadPermissions: jest.fn(() => Promise.resolve({foo: 'bar'}))
  },
  AccessToken: {
    getCurrentAccessToken: jest.fn(() => Promise.resolve({
      accessToken: {
        toString: () => 'token'
      }
    }))
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
