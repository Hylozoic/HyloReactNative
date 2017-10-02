import { mapStateToProps, mapDispatchToProps, mergeProps } from './SignupFlow2.connector'
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
    const dispatch = jest.fn(val => val)
    const dispatchProps = mapDispatchToProps(dispatch)
    expect(dispatchProps).toMatchSnapshot()
    dispatchProps.changeSetting('name')('dan')
    dispatchProps.updateUserSettings({name: 'jan'})
    expect(dispatch).toHaveBeenCalled()
    expect(dispatch.mock.calls).toMatchSnapshot()
  })
})

describe('mergeProps', () => {
  it('merges the props', () => {
    const stateProps = {
      avatarUrl: 'a'
    }
    const dispatchProps = {
      updateUserSettings: jest.fn(() => Promise.resolve())
    }
    const ownProps = {
      navigation: {
        navigate: jest.fn()
      }
    }
    const mergedProps = mergeProps(stateProps, dispatchProps, ownProps)
    expect(mergedProps).toMatchSnapshot()
    mergedProps.saveAndNext()
    expect(dispatchProps.updateUserSettings).toHaveBeenCalled()
    expect(dispatchProps.updateUserSettings.mock.calls)
    .toMatchSnapshot()
  })
})
