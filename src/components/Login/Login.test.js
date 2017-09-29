import 'react-native'
import React from 'react'
import ReactShallowRenderer from 'react-test-renderer/shallow'
import FbLoginButton from './FbLoginButton'
import GoogleLoginButton from './GoogleLoginButton'
import Login from './Login'

jest.mock('react-native-google-signin', () => {})

it('renders Login correctly', () => {
  const renderer = new ReactShallowRenderer()
  renderer.render(<Login goToSignup={() => {}} />)
  const actual = renderer.getRenderOutput()
  expect(actual).toMatchSnapshot()
})

it('renders FB login correctly', () => {
  const renderer = new ReactShallowRenderer()
  renderer.render(<FbLoginButton />)
  const actual = renderer.getRenderOutput()
  expect(actual).toMatchSnapshot()
})

it('renders Google login correctly', () => {
  const renderer = new ReactShallowRenderer()
  renderer.render(<GoogleLoginButton />)
  const actual = renderer.getRenderOutput()
  expect(actual).toMatchSnapshot()
})
