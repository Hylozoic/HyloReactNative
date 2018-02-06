import { mapStateToProps, mapDispatchToProps, mergeProps } from './Topics.connector'
import { MODULE_NAME } from './Topics.store'
import { FETCH_COMMUNITY_TOPICS } from '../../../store/actions/fetchCommunityTopics'

describe('mapStateToProps', () => {
  it('returns the right keys', () => {
    const state = {
      pending: {
        [FETCH_COMMUNITY_TOPICS]: true
      },
      queryResults: {},
      [MODULE_NAME]: {}
    }
    expect(mapStateToProps(state, {})).toMatchSnapshot()
  })
})

describe('mapDispatchToProps', () => {
  it('returns the right keys', () => {
    expect(mapDispatchToProps).toMatchSnapshot()
  })
})

describe('mergeProps', () => {
  it('sets up functions', () => {
    const communityId = 132
    const topicId = 444
    const isSubscribing = true
    const topicName = 'mice'
    const stateProps = {
      community: {
        id: communityId
      }
    }
    const dispatchProps = {
      fetchCommunityTopics: jest.fn(),
      setTopicSubscribe: jest.fn()
    }
    const ownProps = {
      navigation: {
        navigate: jest.fn()
      }
    }
    const mergedProps = mergeProps(stateProps, dispatchProps, ownProps)
    expect(mergedProps).toMatchSnapshot()
    mergedProps.fetchCommunityTopics()
    expect(dispatchProps.fetchCommunityTopics).toHaveBeenCalledWith(communityId, {first: null})
    mergedProps.setTopicSubscribe(topicId, isSubscribing)
    expect(dispatchProps.setTopicSubscribe).toHaveBeenCalledWith(topicId, communityId, isSubscribing)
    mergedProps.goToTopic(topicName)
    expect(ownProps.navigation.navigate).toHaveBeenCalledWith('Feed', {topicName})
  })
})
