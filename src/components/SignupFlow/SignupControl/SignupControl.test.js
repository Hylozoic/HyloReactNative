import 'react-native'
import React from 'react'
import ReactShallowRenderer from 'react-test-renderer/shallow'
import SignupControl from './SignupControl'

it('matches last snapshot', () => {
  const renderer = new ReactShallowRenderer()
  const props = {
    label: 'Name',
    value: 'Joe Bloggs',
    onChange: () => {},
    togglableSecureTextEntry: true,
    keyboardType: 'email-address',
    autoCapitalize: 'words',
    autoCorrect: true,
    style: {color: 'red'},
    error: 'This is not a real name'
  }

  renderer.render(<SignupControl {...props} />)
  const actual = renderer.getRenderOutput()

  expect(actual).toMatchSnapshot()
})
