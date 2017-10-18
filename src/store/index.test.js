import getStore, {getEmptyState } from './index'

jest.mock('react-native-google-signin', () => {})
jest.mock('react-native-device-info')

describe('getStore', () => {
  it('works', () => {
    return getStore().then(store => expect(store).toMatchSnapshot())
  })
})

describe('getEmptyState', () => {
  it('matches last snapshot', () => {
    expect(getEmptyState()).toMatchSnapshot()
  })
})
