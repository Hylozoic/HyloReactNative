import 'react-native'
import ConnectedComponent from './index'

jest.mock('react-native-aws3', () => {})

it('matches last snapshot', () => {
  expect(ConnectedComponent).toBeInstanceOf(Function)
})
