import 'react-native'
import React from 'react'
import ReactTestRenderer from 'react-test-renderer'
import ReactShallowRenderer from 'react-test-renderer/shallow'
import SessionCheck, { INTERNAL_ROUTE_URI_PREFIX } from './SessionCheck'

jest.mock('../RootNavigator', () => 'RootNavigator')
jest.mock('../LoginNavigator', () => 'LoginNavigator')
jest.mock('../Loading', () => 'Loading')
jest.mock('../SocketListener', () => 'SocketListener')
jest.mock('react-native-device-info')

// https://github.com/facebook/jest/issues/2208
// https://github.com/react-community/react-navigation/blob/fc1472dc848ee52382f554d5b61ff36ee0b8f3e7/jest-setup.js
jest.mock('Linking', () => ({
  addEventListener: jest.fn(),
  removeEventListener: jest.fn(),
  openURL: jest.fn(),
  canOpenURL: jest.fn(),
  getInitialURL: jest.fn()
  .mockImplementation((value: string) => Promise.resolve(value))
}))

const defaultRequiredProps = {
  loading: false,
  loggedIn: undefined,
  currentUser: null,
  checkSession: () => Promise.resolve(),
  initOneSignal: () => {},
  setEntryUrl: () => {},
  resetEntryUrl: () => {},
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

describe('SessionCheck component', () => {
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

  test('componentDidMount', async () => {
    const testProps = testPropsSetup({
      checkSession: jest.fn(() => Promise.resolve(true))
    })
    await ReactTestRenderer.create(<SessionCheck {...testProps} />)
    expect(testProps.checkSession).toHaveBeenCalled()
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

    it("shouldn't fetchCurrentUser if loggedIn and there is a currentUser", () => {
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

  describe('componentDidUpdate', () => {
    it('should route to an initial entryUrl exactly when loading is complete and logged-out', () => {
      const prevProps = testPropsSetup()
      const testProps = testPropsSetup({
        loading: false,
        loggedIn: false,
        entryUrl: 'http://anything.com/any/path'
      })
      const instance = ReactTestRenderer.create(<SessionCheck {...testProps} />).getInstance()
      instance.navigator = {
        _handleOpenURL: jest.fn()
      }
      instance.componentDidUpdate(prevProps)
      expect(instance.navigator._handleOpenURL).toHaveBeenCalledWith(testProps.entryUrl)
    })

    it('should route to a new entryUrl if not loading and the user is logged-out', () => {
      const prevProps = testPropsSetup({
        loading: true
      })
      const testProps = testPropsSetup({
        loading: false,
        loggedIn: false,
        entryUrl: 'http://anything.com/any/path'
      })
      const instance = ReactTestRenderer.create(<SessionCheck {...testProps} />).getInstance()
      instance.navigator = {
        _handleOpenURL: jest.fn()
      }
      instance.componentDidUpdate(prevProps)
      expect(instance.navigator._handleOpenURL).toHaveBeenCalledWith(testProps.entryUrl)
    })

    it('should route to the entryUrl and then reset it when the currentUser has completed loading', () => {
      const prevProps = testPropsSetup({
        entryUrl: 'http://anything.com/any/path'
      })
      const testProps = testPropsSetup({
        loggedIn: true,
        currentUser: {id: 1},
        entryUrl: 'http://anything.com/any/path',
        resetEntryUrl: jest.fn()
      })
      const instance = ReactTestRenderer.create(<SessionCheck {...testProps} />).getInstance()
      instance.navigator = {
        _handleOpenURL: jest.fn()
      }
      instance.componentDidUpdate(prevProps)
      expect(testProps.resetEntryUrl).toHaveBeenCalled()
      expect(instance.navigator._handleOpenURL).toHaveBeenCalledWith(testProps.entryUrl)
    })

    it('should route to the first signup step if logged in and signup is not complete', () => {
      const prevProps = testPropsSetup()
      const testProps = testPropsSetup({
        loggedIn: true,
        signupInProgress: true,
        signupStep1Complete: false,
        currentUser: {id: 1}
      })
      const instance = ReactTestRenderer.create(<SessionCheck {...testProps} />).getInstance()
      instance.navigator = {dispatch: jest.fn()}
      instance.componentDidUpdate(prevProps)
      expect(instance.navigator.dispatch).toHaveBeenCalledWith(
        expect.objectContaining({routeName: 'SignupFlow1'})
      )
    })

    it('should route to the second signup step if just completed first step', () => {
      const prevProps = testPropsSetup()
      const testProps = testPropsSetup({
        loggedIn: true,
        signupInProgress: true,
        signupStep1Complete: true,
        currentUser: {id: 1}
      })
      const instance = ReactTestRenderer.create(<SessionCheck {...testProps} />).getInstance()
      instance.navigator = {dispatch: jest.fn()}
      instance.componentDidUpdate(prevProps)
      expect(instance.navigator.dispatch).toHaveBeenCalledWith(
        expect.objectContaining({routeName: 'SignupFlow2'})
      )
    })
  })

  test('_handleSetEntryURL', () => {
    const testProps = testPropsSetup({
      setEntryUrl: jest.fn()
    })
    const instance = ReactTestRenderer.create(<SessionCheck {...testProps} />).getInstance()
    const path = 'any/path'
    const linkingURL = `anything://ANYTHING.AT.ALL/${path}`
    const internalURL = `${INTERNAL_ROUTE_URI_PREFIX}${path}`
    instance._handleSetEntryURL(linkingURL)
    expect(testProps.setEntryUrl).toHaveBeenCalledWith(internalURL)
  })
})
