import {
  mapStateToProps,
  mapDispatchToProps,
  mergeProps
} from './CreateCommunityReview.connector'
import { CREATE_COMMUNITY, MODULE_NAME } from '../CreateCommunityFlow.store'

const communityName = 'name'
const communityUrl = 'my-url'

const state = {
  [MODULE_NAME]: {
    communityName,
    communityUrl
  },
  pending: {
    [CREATE_COMMUNITY]: true
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
    dispatchProps.createCommunity(communityName, communityUrl)
    dispatchProps.clearNameAndUrlFromStore()
    dispatchProps.selectCommunity('community-id')
    expect(dispatch).toHaveBeenCalled()
    expect(dispatch.mock.calls).toMatchSnapshot()
  })
})

describe('mergeProps', () => {
  it('merges the props', () => {
    const id = 1
    const community = {
      id
    }

    const ownProps = {
      navigation: {
        navigate: jest.fn(),
        closeDrawer: jest.fn()
      }
    }

    const dispatchProps = {
      selectCommunity: jest.fn(() => Promise.resolve({}))
    }
    const mergedProps = mergeProps(state, dispatchProps, ownProps)
    expect(mergedProps).toMatchSnapshot()

    mergedProps.goToCreateCommunityName()
    expect(ownProps.navigation.navigate).toHaveBeenCalled()

    mergedProps.goToCreateCommunityUrl()
    expect(ownProps.navigation.navigate).toHaveBeenCalled()

    mergedProps.goToCommunity(community)
    expect(ownProps.navigation.navigate).toHaveBeenCalled()
    expect(dispatchProps.selectCommunity).toHaveBeenCalledWith(community.id)
  })
})
