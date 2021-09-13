// Mocking the global.fetch included in React Native
global.fetch = jest.fn() // eslint-disable-line no-undef
// Helper to mock a success response (only once)
fetch.mockResponseSuccess = body => {
  fetch.mockImplementationOnce(
    () => Promise.resolve({
      status: 200,
      json: () => Promise.resolve(body)
    })
  )
}
// Helper to mock a failure response (only once)
fetch.mockResponseFailure = error => {
  fetch.mockImplementationOnce(
    () => Promise.reject(error)
  )
}

global.FormData = jest.fn(() => {
  return []
})

// React Navigation - https://reactnavigation.org/docs/testing/
import 'react-native-gesture-handler/jestSetup';
jest.mock('react-native-reanimated', () => {
  const Reanimated = require('react-native-reanimated/mock')
  // The mock for `call` immediately calls the callback which is incorrect
  // So we override it with a no-op
  Reanimated.default.call = () => {}
  return Reanimated
})
// Silence the warning: Animated: `useNativeDriver` is not supported because the native animated module is missing
jest.mock('react-native/Libraries/Animated/NativeAnimatedHelper')

jest.mock('react-native-autocomplete-input', () => 'Autocomplete')

jest.mock('mixpanel-react-native', () => {})

jest.mock('react-native-device-info', () => ({
  getVersion: jest.fn()
}))

jest.mock('react-native-intercom', () => {}, { virtual: true })

jest.mock('@react-native-google-signin/google-signin', () => ({
  GoogleSignin: {
    configure: () => {}
  }
}))

jest.mock('react-native-background-timer', () => {})

jest.mock('@sentry/react-native', () => ({
  init: jest.fn()
}))

import mockRNCNetInfo from '@react-native-community/netinfo/jest/netinfo-mock.js'
jest.mock('@react-native-community/netinfo', () => mockRNCNetInfo)

jest.mock('react-native-bootsplash', () => {
  return {
    hide: jest.fn().mockResolvedValueOnce(),
    show: jest.fn().mockResolvedValueOnce(),
    getVisibilityStatus: jest.fn().mockResolvedValue("hidden"),
  };
});

jest.mock('react-native-onesignal', () => ({
  OneSignal: jest.fn(() => 'undefined'),
  setNotificationOpenedHandler: jest.fn(() => 'undefined'),
  init: jest.fn(() => 'undefined'),
  inFocusDisplaying: jest.fn(() => 'undefined'),
  addEventListener: jest.fn(() => 'undefined')
}))

jest.mock('react-native/Libraries/EventEmitter/NativeEventEmitter.js', () => 
  require('react-native/Libraries/EventEmitter/__mocks__/NativeEventEmitter.js')
)

global.XMLHttpRequest = jest.fn()
global.window = {}
