import { mapStateToProps, mapDispatchToProps, mergeProps } from './SignupFlow1.connector'
import { SIGNUP, MODULE_NAME } from '../SignupFlow.store'

describe('mapStateToProps', () => {
  it('returns the right keys', () => {
    const state = {
      pending: {
        [SIGNUP]: true
      },
      [MODULE_NAME]: {
        userSettings: {}
      }
    }
    expect(mapStateToProps(state, {})).toMatchSnapshot()
  })
})

describe('mapDispatchToProps', () => {
  it('maps the action generators', () => {
    const dispatch = jest.fn(val => val)
    const dispatchProps = mapDispatchToProps(dispatch)
    expect(dispatchProps).toMatchSnapshot()
    dispatchProps.signup({name: 'jo', email: 'jo@jo', password: 'Joe Pass'})
    dispatchProps.changeSetting('name', 'yo')
    dispatchProps.updateLocalUserSettings({la: 'la'})
    dispatchProps.updateUserSettings({ra: 'ra'})
    expect(dispatch).toHaveBeenCalled()
    expect(dispatch.mock.calls).toMatchSnapshot()
  })
})

describe('mergeProps', () => {
  it('merges the props', () => {
    const stateProps = {
      name: 'a',
      email: 'b',
      password: 'c',
      currentUser: {
        ref: {
          name: 'aa',
          email: 'bb',
          unused: 'cc'
        }
      },
      showPasswordField: true
    }
    const dispatchProps = {
      signup: jest.fn(() => Promise.resolve({})),
      updateUserSettings: jest.fn(() => Promise.resolve({})),
      updateLocalUserSettings: jest.fn(),
      fetchCurrentUser: jest.fn(() => Promise.resolve())
    }
    const ownProps = {
      navigation: {
        navigate: jest.fn()
      }
    }
    const mergedProps = mergeProps(stateProps, dispatchProps, ownProps)
    expect(mergedProps).toMatchSnapshot()
    mergedProps.loadUserSettings()
    expect(dispatchProps.updateLocalUserSettings).toHaveBeenCalled()
    expect(dispatchProps.updateLocalUserSettings.mock.calls)
    .toMatchSnapshot()
    return mergedProps.signupOrUpdate()
    .then(() => {
      expect(dispatchProps.updateUserSettings).toHaveBeenCalled()
      expect(dispatchProps.updateUserSettings.mock.calls)
      .toMatchSnapshot()
      expect(ownProps.navigation.navigate).toHaveBeenCalledWith('SignupFlow2')
    })
  })
})
