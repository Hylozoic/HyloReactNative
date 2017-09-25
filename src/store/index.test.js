import getStore from './index'

jest.mock('react-native-google-signin', () => {})

it('works', () => {
  return getStore().then(store => expect(store).toMatchSnapshot())
})
