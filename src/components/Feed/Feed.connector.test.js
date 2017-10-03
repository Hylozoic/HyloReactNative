import { mapStateToProps } from './Feed.connector'
import orm from 'store/models'

it('handles a null navigation object', () => {
  const state = {}
  const props = {}
  expect(mapStateToProps(state, props)).toEqual({

  })
})

it('gets props from navigation object', () => {
  const session = orm.session(orm.getEmptyState())
  session.Community.create({id: '7', slug: 'world'})
  session.Me.create({name: 'me'})
  const state = {orm: session.state}
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
    community: {id: '7', slug: 'world'},
    currentUser: undefined,
    topicName: 'logistics'
  })
})
