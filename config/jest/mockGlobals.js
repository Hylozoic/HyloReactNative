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

jest.mock('react-native-device-info')

global.XMLHttpRequest = jest.fn()
global.window = {}

// Mock this globally @see https://github.com/l-urence/react-native-autocomplete-input#known-issues
jest.mock('react-native-autocomplete-input', () => 'Autocomplete')
