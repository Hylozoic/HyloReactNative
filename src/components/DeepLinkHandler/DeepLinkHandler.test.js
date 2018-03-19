import DeepLinkHandler from './DeepLinkHandler'
import TestRenderer from 'react-test-renderer'
import React from 'react'

jest.mock('util/platform', () => ({isIOS: true}))
jest.mock('react-native-htmlview', () => {})
jest.mock('react-native-onesignal', () => ({
  addEventListener: jest.fn()
}))

// this is needed because DeepLinkHandler uses setImmediate
jest.useFakeTimers()

const user = {id: '1'}
const initialUrl = '/t/17'
const navigateAction = {
  type: 'Navigation/NAVIGATE',
  routeName: 'Thread',
  params: {id: '17'}
}

let mockNavigator

beforeEach(() => {
  mockNavigator = {
    navigate: jest.fn(),
    dispatch: jest.fn()
  }
})

function expectResetToRoute (routeName) {
  expect(mockNavigator.dispatch).toHaveBeenCalledWith({
    actions: [
      {routeName, type: 'Navigation/NAVIGATE'}
    ],
    index: 0,
    key: null,
    type: 'Navigation/RESET'
  })
}

it('sends a logged-in user to Main', async () => {
  await TestRenderer.create(<DeepLinkHandler currentUser={user}
    navigator={mockNavigator} />)
  expectResetToRoute('Main')
})

it('sends a logged-out user to Login', async () => {
  await TestRenderer.create(<DeepLinkHandler navigator={mockNavigator} />)
  expectResetToRoute('Login')
})

it('handles an initial push notification event', async () => {
  const event = {
    notification: {
      payload: {
        additionalData: {path: initialUrl}
      }
    }
  }

  await TestRenderer.create(<DeepLinkHandler currentUser={user}
    navigator={mockNavigator}
    initialPushNotificationEvent={event} />)

  jest.runAllImmediates()

  expect(mockNavigator.dispatch).toHaveBeenLastCalledWith(navigateAction)
})

it('handles an initial url', async () => {
  await TestRenderer.create(<DeepLinkHandler currentUser={user}
    initialUrl={initialUrl}
    navigator={mockNavigator} />)

  jest.runAllImmediates()

  expect(mockNavigator.dispatch).toHaveBeenLastCalledWith(navigateAction)
})

it('stores the action for a logged-out user', async () => {
  const storeNavigationAction = jest.fn()

  await TestRenderer.create(<DeepLinkHandler initialUrl={initialUrl}
    storeNavigationAction={storeNavigationAction}
    navigator={mockNavigator} />)

  jest.runAllImmediates()

  expect(mockNavigator.dispatch).toHaveBeenCalledTimes(1)
  expect(storeNavigationAction).toHaveBeenCalledWith(navigateAction)
})

it('redirects to an invitation link for a logged-out user', async () => {
  const storeNavigationAction = jest.fn()
  const invitationUrl = '/c/sandbox/join/foo'
  const joinAction = {
    type: 'Navigation/NAVIGATE',
    routeName: 'UseAccessCode',
    params: {
      accessCode: 'foo',
      slug: 'sandbox'
    }
  }

  await TestRenderer.create(<DeepLinkHandler initialUrl={invitationUrl}
    storeNavigationAction={storeNavigationAction}
    navigator={mockNavigator} />)

  jest.runAllImmediates()

  expect(mockNavigator.dispatch).toHaveBeenLastCalledWith(joinAction)
  expect(storeNavigationAction).toHaveBeenCalledWith(joinAction)
})
