import {
  mapStateToProps,
  mapDispatchToProps,
  mergeProps
} from './CreateGroupName.connector'
import { MODULE_NAME } from '../CreateGroupFlow.store'
const groupName = 'name'

const state = {
  [MODULE_NAME]: {
    groupData: { 
      name: groupName
    }
  }
}

describe('mapStateToProps', () => {
  it('returns the right keys', () => {
    expect(mapStateToProps(state, {})).toMatchSnapshot()
  })
})

describe('mapDispatchToProps', () => {
  it('maps the action generators', () => {
    expect(mapDispatchToProps.hasOwnProperty('updateGroupData')).toBeTruthy()
    expect(mapDispatchToProps.updateGroupData({ name: groupName })).toMatchSnapshot()
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
    mergedProps.goToCreateGroupUrl()
    expect(ownProps.navigation.navigate).toHaveBeenCalled()
  })
})
