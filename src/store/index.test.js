import getStore, { getEmptyState } from './index'

jest.mock('react-native-google-signin', () => {})

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
