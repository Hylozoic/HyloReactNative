import 'react-native'
import React from 'react'
import ReactTestRenderer from 'react-test-renderer'
import ReactShallowRenderer from 'react-test-renderer/shallow'
import SessionCheck from './SessionCheck'

jest.mock('../RootNavigator', () => 'RootNavigator')
jest.mock('../LoginNavigator', () => 'LoginNavigator')
jest.mock('../Loading', () => 'Loading')
jest.mock('react-native', () => ({
  View: () => () => <div />,
  Linking: {
    getInitialURL: () => Promise.resolve(),
    addEventListener: () => {},
    removeEventListener: jest.fn()
  },
  Platform: {OS: 'ios'}
}))

const defaultRequiredProps = {
  loading: false,
  loggedIn: false,
  currentUser: null,
  checkSession: () => {},
  initOneSignal: () => {},
  setEntryURL: () => {},
  resetEntryURL: () => {},
  fetchCurrentUser: () => {}
}

function testPropsSetup (props = {}, required = defaultRequiredProps) {
  return {...required, ...props}
}

function shallowRender (props) {
  const renderer = new ReactShallowRenderer()
  renderer.render(<SessionCheck {...testPropsSetup(props)} />)
  return renderer
}

it('matches last snapshot - default', () => {
  const actual = shallowRender().getRenderOutput()
  expect(actual).toMatchSnapshot()
})

it('matches last snapshot - loading', () => {
  const testProps = {
    loading: true
  }
  const actual = shallowRender(testProps).getRenderOutput()
  expect(actual).toMatchSnapshot()
})

it('matches last snapshot - not loggedIn', () => {
  const testProps = {
    loggedIn: false
  }
  const actual = shallowRender(testProps).getRenderOutput()
  expect(actual).toMatchSnapshot()
})

it('matches last snapshot - loggedIn without a currentUser', () => {
  const testProps = {
    loggedIn: true
  }
  const actual = shallowRender(testProps).getRenderOutput()
  expect(actual).toMatchSnapshot()
})

it('matches last snapshot - loggedIn with a currentUser', () => {
  const testProps = {
    loggedIn: true,
    currentUser: {}
  }
  const actual = shallowRender(testProps).getRenderOutput()
  expect(actual).toMatchSnapshot()
})

// Lifecycle Methods

test('componentDidMount', () => {
  const testProps = testPropsSetup({
    checkSession: jest.fn(),
    initOneSignal: jest.fn()
  })
  ReactTestRenderer.create(<SessionCheck {...testProps} />)
  expect(testProps.checkSession).toHaveBeenCalled()
  expect(testProps.initOneSignal).toHaveBeenCalled()
})

describe('componentWillUpdate', () => {
  it('should fetchCurrentUser if loggedIn without a currentUser', () => {
    const testProps = testPropsSetup({
      pending: false,
      loggedIn: true,
      currentUser: null,
      fetchCurrentUser: jest.fn()
    })
    const instance = ReactTestRenderer.create(<SessionCheck {...testPropsSetup()} />).getInstance()
    instance.componentWillUpdate(testProps)
    expect(testProps.fetchCurrentUser).toHaveBeenCalled()
  })

  it('shouldn\'t fetchCurrentUser if loggedIn and there is a currentUser', () => {
    const testProps = testPropsSetup({
      pending: false,
      loggedIn: true,
      currentUser: {},
      fetchCurrentUser: jest.fn()
    })
    const instance = ReactTestRenderer.create(<SessionCheck {...testProps} />).getInstance()
    instance.componentWillUpdate(testProps)
    expect(testProps.fetchCurrentUser).not.toHaveBeenCalled()
  })
})

test('componentDidUpdate', () => {
  const testProps = testPropsSetup({
    entryURL: 'anything',
    loggedIn: true,
    currentUser: {},
    resetEntryURL: jest.fn()
  })
  const prevProps = testPropsSetup()
  const instance = ReactTestRenderer.create(<SessionCheck {...testProps} />).getInstance()
  const navigator = {
    _handleOpenURL: jest.fn()
  }
  instance.navigator = navigator
  instance.componentDidUpdate(prevProps)
  expect(navigator._handleOpenURL).toHaveBeenCalledWith(testProps.entryURL)
  expect(testProps.resetEntryURL).toHaveBeenCalled()
})

test('_handleOpenURL', () => {
  const testProps = testPropsSetup({
    setEntryURL: jest.fn()
  })
  const instance = ReactTestRenderer.create(<SessionCheck {...testProps} />).getInstance()
  const url = '/any/path'
  const navigator = {
    _handleOpenURL: jest.fn()
  }
  instance.navigator = navigator
  instance._handleOpenURL(url)
  expect(testProps.setEntryURL).toHaveBeenCalledWith(url)
  expect(navigator._handleOpenURL).toHaveBeenCalled()
})

it('matches last snapshot for _handleChange')

test('componentWillUnmount removes event listener')
