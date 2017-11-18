import { mapStateToProps } from './SessionCheck.connector.js'
import { MODULE_NAME as SignupFlowStoreKey } from '../SignupFlow/SignupFlow.store'

jest.mock('react-native-device-info')

describe('mapStateToProps', () => {
  it('returns the right keys', () => {
    const defaultState = {
      session: {
        loggedIn: true,
        entryUrl: 'http://www.hylo.com/a/path'
      },
      pending: {},
      [SignupFlowStoreKey]: {}
    }
    expect(mapStateToProps(defaultState)).toMatchSnapshot()
  })
})
