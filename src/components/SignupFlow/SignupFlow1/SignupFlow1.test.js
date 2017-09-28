import 'react-native'
import React from 'react'
import ReactShallowRenderer from 'react-test-renderer/shallow'
import ReactTestRenderer from 'react-test-renderer'
import SignupFlow1 from './SignupFlow1'

jest.mock('../../KeyboardFriendlyView', () => 'KeyboardFriendlyView')

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

it('calls functions on mount', () => {
  const props = {
    currentUser: {id: 1},
    fetchCurrentUser: jest.fn(),
    loadUserSettings: jest.fn()
  }
  ReactTestRenderer.create(<SignupFlow1 {...props} />)
  expect(props.fetchCurrentUser).toHaveBeenCalled()
  expect(props.loadUserSettings).toHaveBeenCalled()
})

it('loads user settings and updates errors on update when appropriate', () => {
  const props = {
    currentUser: {id: 1},
    errors: {
      email: 'one error'
    },
    loadUserSettings: jest.fn(),
    fetchCurrentUser: () => {}
  }
  const instance = ReactTestRenderer.create(<SignupFlow1 {...props} />).root.instance
  props.loadUserSettings.mockClear()

  instance.componentDidUpdate(props)
  expect(props.loadUserSettings).not.toHaveBeenCalled()
  expect(instance.state.errors).toMatchSnapshot()

  const differentProps = {
    currentUser: {id: 2},
    errors: {
      email: 'old error'
    }
  }

  instance.componentDidUpdate(differentProps)
  expect(props.loadUserSettings).toHaveBeenCalled()
  expect(instance.state.errors).toMatchSnapshot()
})

it('validates its fields', () => {
  const props = {
    name: '',
    email: 'ra',
    password: 'rarara',
    showPasswordField: true,
    fetchCurrentUser: () => {},
    loadUserSettings: () => {}
  }

  const instance = ReactTestRenderer.create(<SignupFlow1 {...props} />).root.instance
  expect(instance.validate()).toBeFalsy()
  expect(instance.state).toMatchSnapshot()
})

it('clears errors when updating fields', () => {
  const props = {
    changeSetting: jest.fn(),
    fetchCurrentUser: () => {},
    loadUserSettings: () => {}
  }

  const instance = ReactTestRenderer.create(<SignupFlow1 {...props} />).root.instance
  instance.setState({
    errors: {
      email: 'yes',
      name: 'yes'
    }
  })
  instance.updateField('email', 'new@email')
  expect(instance.state.errors).toEqual({
    email: null,
    name: 'yes'
  })
})

it('has navigationOptions', () =>
  expect(SignupFlow1.navigationOptions()).toMatchSnapshot())
