import {
  mapStateToProps,
  mapDispatchToProps,
  mergeProps
} from './CreateGroupReview.connector'
import { CREATE_GROUP, MODULE_NAME } from '../CreateGroupFlow.store'

const groupName = 'name'
const groupUrl = 'my-url'

const state = {
  [MODULE_NAME]: {
    groupName,
    groupUrl
  },
  pending: {
    [CREATE_GROUP]: true
  }
}

describe('mapStateToProps', () => {
  it('returns the right keys', () => {
    expect(mapStateToProps(state, {})).toMatchSnapshot()
  })
})

describe('mapDispatchToProps', () => {
  it('maps the action generators', () => {
    const dispatch = jest.fn(val => val)
    const dispatchProps = mapDispatchToProps(dispatch)
    expect(dispatchProps).toMatchSnapshot()
    dispatchProps.createGroup(groupName, groupUrl)
    dispatchProps.clearNameAndUrlFromStore()
    expect(dispatch).toHaveBeenCalled()
    expect(dispatch.mock.calls).toMatchSnapshot()
  })
})

describe('mergeProps', () => {
  it('merges the props', () => {
    const id = 1
    const group = {
      id
    }

    const ownProps = {
      navigation: {
        navigate: jest.fn(),
        closeDrawer: jest.fn()
      }
    }

    const dispatchProps = {
      selectGroup: jest.fn(() => Promise.resolve({}))
    }
    const mergedProps = mergeProps(state, dispatchProps, ownProps)
    expect(mergedProps).toMatchSnapshot()

    mergedProps.goToCreateGroupName()
    expect(ownProps.navigation.navigate).toHaveBeenCalled()

    mergedProps.goToCreateGroupUrl()
    expect(ownProps.navigation.navigate).toHaveBeenCalled()

    mergedProps.goToGroup(group)
    expect(ownProps.navigation.navigate).toHaveBeenCalled()
  })
})
