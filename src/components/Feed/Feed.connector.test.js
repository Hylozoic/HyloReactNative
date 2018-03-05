import { mapStateToProps, mapDispatchToProps, mergeProps } from './Feed.connector'
import orm from 'store/models'
import { FETCH_COMMUNITY_TOPIC } from './Feed.store'

let session, state

beforeEach(() => {
  session = orm.mutableSession(orm.getEmptyState())
  state = {orm: session.state}
})

describe('mapStateToProps', () => {
  it('handles a null navigation object', () => {
    const props = {}
    expect(mapStateToProps(state, props)).toEqual({
      community: null,
      currentUser: undefined,
      network: false,
      topic: undefined,
      topicSubscribed: undefined,
      topicName: undefined,
      followersTotal: undefined,
      postsTotal: undefined,
      currentUserHasMemberships: false
    })
  })

  it('gets props from navigation object', () => {
    const community = session.Community.create({id: '7', slug: 'world'})
    const topic = session.Topic.create({id: '111', name: 'logistics'})
    session.CommunityTopic.create({community: '7', topic: '111', isSubscribed: false, followersTotal: 10, postsTotal: 20})
    const currentUser = session.Me.create({name: 'me'})
    const props = {
      navigation: {
        state: {
          params: {
            topicName: 'logistics',
            communityId: '7'
          }
        }
      }
    }
    expect(mapStateToProps(state, props)).toEqual({
      community,
      currentUser,
      network: false,
      followersTotal: 10,
      postsTotal: 20,
      topic,
      topicName: 'logistics',
      topicSubscribed: false,
      currentUserHasMemberships: false
    })
  })

  it('has topicSubscribed=undefined when pending topic fetch', () => {
    state.pending = {[FETCH_COMMUNITY_TOPIC]: true}
    session.Community.create({id: '7', slug: 'world'})
    const props = {topicName: 'foo', communityId: '7'}

    expect(mapStateToProps(state, props)).toEqual(expect.objectContaining({
      topicSubscribed: undefined
    }))
  })

  it('has topicSubscribed=true when subscribed', () => {
    session.Community.create({id: '7', slug: 'world'})
    session.Topic.create({id: '1', name: 'foo'})
    session.CommunityTopic.create({community: '7', topic: '1', isSubscribed: true})
    const props = {topicName: 'foo', communityId: '7'}

    expect(mapStateToProps(state, props)).toEqual(expect.objectContaining({
      topicSubscribed: true
    }))
  })
})

describe('mergeProps', () => {
  let navigation, dispatch, dispatchProps, stateProps, ownProps

  beforeEach(() => {
    navigation = {navigate: jest.fn()}
    dispatch = jest.fn(x => x)
    dispatchProps = mapDispatchToProps(dispatch, {navigation})
    stateProps = {community: {id: '12', slug: 'life'}, otherProp1: 'foo1'}
    ownProps = {otherProp2: 'foo2'}
  })

  it('binds communityId to functions from dispatchProps', () => {
    const props = mergeProps(stateProps, dispatchProps, ownProps)
    expect(props).toMatchSnapshot()

    props.newPost()
    expect(navigation.navigate)
    .toBeCalledWith('PostEditor', {communityId: '12'})

    props.showTopic('disarmament')
    expect(navigation.navigate)
    .toBeCalledWith('Feed', {communityId: '12', topicName: 'disarmament'})
  })

  it('binds networkId to showTopic from dispatchProps', () => {
    const testStateProps = {
      ...stateProps,
      network: {id: 'anynetworkId'}
    }
    const props = mergeProps(
      testStateProps,
      dispatchProps,
      ownProps
    )

    props.showTopic('anything')
    expect(navigation.navigate).toBeCalledWith('TopicSupportComingSoon')
  })

  it('sets up fetchCommunityTopic', () => {
    stateProps.topicName = 'inquiry'
    const props = mergeProps(stateProps, dispatchProps, ownProps)
    expect(props.fetchCommunityTopic()).toMatchSnapshot()
  })

  it('sets up setTopicSubscribe', () => {
    stateProps.topic = {id: '5', name: 'inquiry'}
    const props = mergeProps(stateProps, dispatchProps, ownProps)
    expect(props.setTopicSubscribe()).toMatchSnapshot()
  })
})
