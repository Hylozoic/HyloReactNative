import {
  mapStateToProps,
  mapDispatchToProps,
  mergeProps
} from './CreateCommunityName.connector'
import { MODULE_NAME } from '../CreateCommunityFlow.store'
const communityName = 'name'

const state = {
  [MODULE_NAME]: {
    communityName
  }
}

describe('mapStateToProps', () => {
  it('returns the right keys', () => {
    expect(mapStateToProps(state, {})).toMatchSnapshot()
  })
})

describe('mapDispatchToProps', () => {
  it('maps the action generators', () => {
    expect(mapDispatchToProps.hasOwnProperty('saveCommunityName')).toBeTruthy()
    expect(mapDispatchToProps.saveCommunityName(communityName)).toMatchSnapshot()
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
    mergedProps.goToCreateCommunityUrl()
    expect(ownProps.navigation.navigate).toHaveBeenCalled()
  })
})
