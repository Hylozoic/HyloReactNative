import {
  ormSessionReducer,
  DELETE_POST_PENDING,
  REMOVE_POST_PENDING
} from './PostHeader.store'
import orm from 'store/models'

describe('ormSessionReducer', () => {
  let session, group
  beforeEach(() => {
    session = orm.session(orm.getEmptyState())
    group = session.Group.create({ id: 20, slug: 'postheadertest' })
  })

  it('handles DELETE_POST', () => {
    session.Post.create({ id: '1' })

    const action = {
      type: DELETE_POST_PENDING,
      meta: {
        id: 1
      }
    }

    expect(session.Post.idExists('1')).toBeTruthy()
    ormSessionReducer(session, action)
    expect(session.Post.idExists('1')).toBeFalsy()
  })

  it('handles REMOVE_POST', () => {
    session.Post.create({ id: '11', groups: [group] })

    const action = {
      type: REMOVE_POST_PENDING,
      meta: {
        postId: 11,
        slug: 'postheadertest'
      }
    }

    expect(session.Post.withId(11).groups.toRefArray()).toHaveLength(1)
    ormSessionReducer(session, action)
    expect(session.Post.withId(11).groups.toRefArray()).toHaveLength(0)
  })
})
