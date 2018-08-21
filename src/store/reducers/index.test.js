import reducers from './index'

jest.mock('react-native-google-signin')
jest.mock('react-native-device-info')
jest.mock('react-native-mixpanel')

it('sets up the expected reducers', () => {
  const action = {type: 'HELLO_WORLD', payload: 'hello world'}
  expect(reducers({}, action)).toMatchSnapshot()
})
