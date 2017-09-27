import 'react-native'
import React from 'react'
import ReactShallowRenderer from 'react-test-renderer/shallow'
import SignupFlow1 from './SignupFlow1'

it('matches last snapshot', () => {
  const renderer = new ReactShallowRenderer()
  const props = {
    name: 'Ra',
    email: 'ra@ra.com',
    password: 'rarara',
    pending: false,
    showPasswordField: true
  }

  renderer.render(<SignupFlow1 {...props} />)
  const actual = renderer.getRenderOutput()

  expect(actual).toMatchSnapshot()
})

it('hides password, and changes button when pending ', () => {
  const renderer = new ReactShallowRenderer()
  const props = {
    name: 'Ra',
    email: 'ra@ra.com',
    password: 'rarara',
    pending: true,
    showPasswordField: false
  }

  renderer.render(<SignupFlow1 {...props} />)
  const actual = renderer.getRenderOutput()

  expect(actual).toMatchSnapshot()
})
