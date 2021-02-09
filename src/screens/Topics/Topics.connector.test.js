import { mapStateToProps, mapDispatchToProps, mergeProps } from './Topics.connector'
import { MODULE_NAME } from './Topics.store'
import { FETCH_GROUP_TOPICS } from 'store/actions/fetchGroupTopics'

describe('mapStateToProps', () => {
  it('returns the right keys', () => {
    const state = {
      pending: {
        [FETCH_GROUP_TOPICS]: true
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
    const groupId = 132
    const topicId = 444
    const isSubscribing = true
    const topicName = 'mice'
    const stateProps = {
      group: {
        id: groupId
      }
    }
    const dispatchProps = {
      fetchGroupTopics: jest.fn(),
      setTopicSubscribe: jest.fn()
    }
    const ownProps = {
      navigation: {
        navigate: jest.fn()
      }
    }
    const mergedProps = mergeProps(stateProps, dispatchProps, ownProps)
    expect(mergedProps).toMatchSnapshot()
    mergedProps.fetchGroupTopics()
    expect(dispatchProps.fetchGroupTopics).toHaveBeenCalledWith(groupId, { first: null })
    mergedProps.setTopicSubscribe(topicId, isSubscribing)
    expect(dispatchProps.setTopicSubscribe).toHaveBeenCalledWith(topicId, groupId, isSubscribing)
    mergedProps.goToTopic(topicName)
    expect(ownProps.navigation.navigate).toHaveBeenCalledWith('Topic Feed', { topicName: topicName })
  })
})
