import {
  mapStateToProps,
  mapDispatchToProps,
  mergeProps
} from './CreateGroupUrl.connector'
import { FETCH_URL_EXISTS, MODULE_NAME } from '../CreateGroupFlow.store'

const groupUrl = 'my-url'

const state = {
  [MODULE_NAME]: {
    groupUrl,
    urlExists: false
  },
  pending: {
    [FETCH_URL_EXISTS]: true
  }
}

describe('mapStateToProps', () => {
  it('returns the right keys', () => {
    expect(mapStateToProps(state, {})).toMatchSnapshot()
  })
})

describe('mapDispatchToProps', () => {
  it('maps the action generators', () => {
    expect(mapDispatchToProps.hasOwnProperty('fetchGroupExists')).toBeTruthy()
    expect(mapDispatchToProps.hasOwnProperty('saveGroupUrl')).toBeTruthy()
    expect(mapDispatchToProps.saveGroupUrl(groupUrl)).toMatchSnapshot()
  })
})

describe('mergeProps', () => {
  it('merges the props', () => {
    const ownProps = {
      navigation: {
        navigate: jest.fn()
      }
    }
    const mergedProps = mergeProps(state, {}, ownProps)
    expect(mergedProps).toMatchSnapshot()
    mergedProps.goToNextStep()
    expect(ownProps.navigation.navigate).toHaveBeenCalled()
  })
})
