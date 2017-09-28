import 'react-native'
import React from 'react'
import ReactShallowRenderer from 'react-test-renderer/shallow'
import SignupFlow5 from './SignupFlow5'

it('matches last snapshot', () => {
  const renderer = new ReactShallowRenderer()
  const props = {
    name: 'Hill',
    email: 'jill@hill.com',
    password: 'fill',
    location: 'hill',
    avatarUrl: 'mill.png',
    skills: ['One', 'Two'],
    finishSignup: () => {},
    makeChanges: () => {}
  }

  renderer.render(<SignupFlow5 {...props} />)
  const actual = renderer.getRenderOutput()

  expect(actual).toMatchSnapshot()
})

it('hides image when no url', () => {
  const renderer = new ReactShallowRenderer()
  const props = {
    name: 'Hill',
    email: 'jill@hill.com',
    password: 'fill',
    location: 'hill',
    avatarUrl: '',
    skills: ['One', 'Two'],
    finishSignup: () => {},
    makeChanges: () => {}
  }

  renderer.render(<SignupFlow5 {...props} />)
  const actual = renderer.getRenderOutput()

  expect(actual).toMatchSnapshot()
})

it('has navigationOptions', () =>
  expect(SignupFlow5.navigationOptions()).toMatchSnapshot())
