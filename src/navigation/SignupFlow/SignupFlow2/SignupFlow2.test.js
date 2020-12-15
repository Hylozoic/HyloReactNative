import 'react-native'
import React from 'react'
import ReactShallowRenderer from 'react-test-renderer/shallow'
import ReactTestRenderer from 'react-test-renderer'
import SignupFlow2 from './SignupFlow2'

jest.mock('components/ImagePicker', () => 'ImagePicker')

it('matches last snapshot', () => {
  const renderer = new ReactShallowRenderer()
  const props = {
    avatarUrl: 'foo.png',
    saveAndNext: () => {},
    changeSetting: () => {},
    currentUser: { id: '1' }
  }

  renderer.render(<SignupFlow2 {...props} />)
  const actual = renderer.getRenderOutput()

  expect(actual).toMatchSnapshot()
})

it('handles no image', () => {
  const renderer = new ReactShallowRenderer()
  const props = {
    saveAndNext: () => {},
    changeSetting: () => {},
    currentUser: { id: '1' }
  }

  renderer.render(<SignupFlow2 {...props} />)
  const actual = renderer.getRenderOutput()

  expect(actual).toMatchSnapshot()
})

it('handles localUri', () => {
  const props = {
    saveAndNext: () => {},
    changeSetting: () => {},
    currentUser: { id: '1' }
  }

  const renderer = ReactTestRenderer.create(<SignupFlow2 {...props} />)
  renderer.root.instance.setState({ localUri: 'foo.png' })
  expect(renderer.toJSON()).toMatchSnapshot()
})

it('handles choice', () => {
  const props = {
    saveAndNext: () => {},
    changeSetting: jest.fn(() => () => {}),
    currentUser: { id: '1' }
  }

  const instance = ReactTestRenderer.create(<SignupFlow2 {...props} />).root.instance
  const choice = {
    local: 'foo.png',
    remote: 'www.foo.png'
  }
  instance.onChoice(choice)
  expect(props.changeSetting).toHaveBeenCalled()
  expect(props.changeSetting.mock.calls).toEqual([['avatarUrl']])
  expect(instance.state).toMatchSnapshot()
})

it('has navigationOptions', () =>
  expect(SignupFlow2.navigationOptions()).toMatchSnapshot())
