import {
  mapStateToProps,
  mapDispatchToProps,
  mergeProps
} from './CreateCommunityUrl.connector'
import { FETCH_URL_EXISTS } from '../CreateCommunityFlow.store'

const communityUrl = 'my-url'

const state = {
  CreateCommunityFlow: {
    communityUrl,
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
    expect(mapDispatchToProps.hasOwnProperty('fetchCommunityExists')).toBeTruthy()
    expect(mapDispatchToProps.hasOwnProperty('saveCommunityUrl')).toBeTruthy()
    expect(mapDispatchToProps.saveCommunityUrl(communityUrl)).toMatchSnapshot()
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
    mergedProps.goToCreateCommunityReview()
    expect(ownProps.navigation.navigate).toHaveBeenCalled()
  })
})
