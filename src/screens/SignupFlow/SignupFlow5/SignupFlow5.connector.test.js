import { mapStateToProps, mapDispatchToProps, mergeProps } from './SignupFlow5.connector'
import { MODULE_NAME } from '../SignupFlow.store'

describe('mapStateToProps', () => {
  it('returns the right keys', () => {
    const state = {
      [MODULE_NAME]: {
        userSettings: {}
      }
    }
    expect(mapStateToProps(state, {})).toMatchSnapshot()
  })
})

describe('mapDispatchToProps', () => {
  it('maps the action generators', () => {
    expect(mapDispatchToProps).toMatchSnapshot()
  })
})

describe('mergeProps', () => {
  it('merges the props', () => {
    const deepLinkAction = {
      type: 'Navigation/NAVIGATE',
      routeName: 'UseAccessCode',
      params: { accessCode: 'foo', slug: 'sandbox' }
    }
    const stateProps = {
      storedSkills: ['a', 'b', 'c'],
      deepLinkAction
    }
    const dispatchProps = {
      updateUserSettings: jest.fn(),
      updateLocalUserSettings: jest.fn()
    }
    const ownProps = {
      navigation: {
        navigate: jest.fn(),
        dispatch: jest.fn()
      }
    }
    const mergedProps = mergeProps(stateProps, dispatchProps, ownProps)
    expect(mergedProps).toMatchSnapshot()
    mergedProps.finishSignup()
    expect(dispatchProps.updateUserSettings).toHaveBeenCalled()
    expect(dispatchProps.updateUserSettings.mock.calls)
      .toMatchSnapshot()
    expect(dispatchProps.updateLocalUserSettings).toHaveBeenCalled()
    expect(dispatchProps.updateLocalUserSettings.mock.calls)
      .toMatchSnapshot()
    expect(ownProps.navigation.dispatch).toHaveBeenCalledWith(deepLinkAction)
  })
})