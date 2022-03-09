import { mapStateToProps } from './Comment.connector'
import orm from 'store/models'

let session, state

beforeEach(() => {
  session = orm.mutableSession(orm.getEmptyState())
  state = {
    orm: session.state,
    queryResults: {}
  }
})

describe('mapStateToProps', () => {
  it('maps', () => {
    const group = session.Group.create({ id: '7', slug: 'world' })
    session.Me.create({
      name: 'me',
      id: 10,
      memberships: [session.Membership.create({
        id: '345',
        group: group.id,
        hasModeratorRole: true
      })]
    })

    const props = {
      slug: group.slug,
      comment: {
        creator: {
          id: 10
        }
      }
    }

    expect(mapStateToProps(state, props)).toEqual({
      canModerate: true,
      isCreator: true
    })
  })
})
