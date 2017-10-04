import { mapStateToProps, mapDispatchToProps, mergeProps } from './Feed.connector'
import orm from 'store/models'

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
      topicName: undefined
    })
  })

  it('gets props from navigation object', () => {
    session.Community.create({id: '7', slug: 'world'})
    session.Me.create({name: 'me'})
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
      community: expect.objectContaining({id: '7', slug: 'world'}),
      currentUser: expect.objectContaining({name: 'me'}),
      topicName: 'logistics'
    })
  })
})

describe('mergeProps', () => {
  let navigation, dispatchProps, stateProps, ownProps

  beforeEach(() => {
    navigation = {navigate: jest.fn()}
    dispatchProps = mapDispatchToProps(null, {navigation})
    stateProps = {community: {id: '12'}, otherProp1: 'foo1'}
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
})
