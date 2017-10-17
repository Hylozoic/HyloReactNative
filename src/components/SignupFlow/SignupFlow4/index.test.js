import 'react-native'
import ConnectedComponent from './index'

jest.mock('react-native-device-info')

it('is a function', () => {
  expect(ConnectedComponent).toBeInstanceOf(Function)
})
