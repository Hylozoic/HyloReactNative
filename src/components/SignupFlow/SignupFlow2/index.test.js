import 'react-native'
import ConnectedComponent from './index'

jest.mock('react-native-aws3', () => {})

it('is a function', () => {
  expect(ConnectedComponent).toBeInstanceOf(Function)
})
