import { mapStateToProps, mapDispatchToProps } from './VersionCheck.connector.js'

jest.mock('react-native-device-info', () => {
  return {
    default: {
      getVersion: jest.fn()
    },
    getVersion: jest.fn(() => '2.0')
  }
})

describe('mapStateToProps', () => {
  it('returns the right keys', () => {
    const state = {
      session: {
        checkVersion: {type: true}
      },
      pending: {
        CHECK_VERSION: true
      }
    }
    expect(mapStateToProps(state)).toMatchSnapshot()
  })
})

describe('mapDispatchToProps', () => {
  it('maps the action generators', () => {
    const dispatch = jest.fn(val => val)
    const dispatchProps = mapDispatchToProps(dispatch)
    expect(dispatchProps).toMatchSnapshot()
    dispatchProps.checkVersion()
    expect(dispatch).toHaveBeenCalled()
    expect(dispatch.mock.calls).toMatchSnapshot()
  })
})
