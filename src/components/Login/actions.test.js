import { clearCurrentUser } from './actions'

jest.mock('react-native-google-signin', () => {})

describe('clearCurrentUser', () => {
  it('matches snapshot', () => expect(clearCurrentUser()).toMatchSnapshot())
})
