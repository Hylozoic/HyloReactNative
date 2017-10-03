import { mapStateToProps } from './Feed.connector'
import orm from 'store/models'

let session, state

beforeEach(() => {
  session = orm.mutableSession(orm.getEmptyState())
  state = {orm: session.state}
})

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
