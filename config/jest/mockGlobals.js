// General enzyme setup that should work:
// https://medium.com/@arnoldsebastian_19154/react-native-test-driven-development-part-1-d2794feacefc
// import React from 'react'
// import 'react-native'
// import 'react-native-mock-render/mock'
// import { configure } from 'enzyme'
// import Adapter from 'enzyme-adapter-react-15'
// Once this import works without the "super() error" (it doesn't)
// we can make enzyme work.
// import { JSDOM } from 'jsdom'

// source:
// https://blog.callstack.io/unit-testing-react-native-with-the-new-jest-ii-redux-snapshots-for-your-actions-and-reducers-8559f6f8050b

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

// Mock this globally @see https://github.com/l-urence/react-native-autocomplete-input#known-issues
jest.mock('react-native-autocomplete-input', () => 'Autocomplete')
jest.mock('react-native-mixpanel')
jest.mock('react-native-device-info')
jest.mock('react-native-intercom', () => {}, { virtual: true });
jest.mock('react-native/Libraries/Animated/src/NativeAnimatedHelper')

global.XMLHttpRequest = jest.fn()
global.window = {}
