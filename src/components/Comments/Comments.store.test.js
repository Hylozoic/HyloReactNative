import { fetchComments, getComments } from './Comments.store'
import orm from 'store/models'

it('matches the last snapshot for fetchComments', () => {
  expect(fetchComments(1, { cursor: 20 })).toMatchSnapshot()
})

describe('getComments', () => {
  let session
  let state

  beforeEach(() => {
    session = orm.mutableSession(orm.getEmptyState())
    const post = session.Post.create({ id: '1', commentsTotal: 5 })
    session.Comment.create({ id: '1', post })
    session.Comment.create({ id: '2', post })
    session.Comment.create({ id: '3', post })
    session.Comment.create({ id: '4', post })
    session.Comment.create({ id: '5', post })
    state = { orm: session.state }
  })

  it('should return empty array for non-existent post', () => {
    expect(getComments(state, { postId: '99' })).toEqual([])
  })

  it('should return comments with total', () => {
    const { total, comments } = getComments(state, { postId: '1' })
    expect(total).toBe(5)

    // NOTE: this won't always be true in practice, because paging
    expect(comments.length).toBe(5)
  })

  it('should return comments ordered by id', () => {
    const { comments } = getComments(state, { postId: '1' })
    const ids = comments.map(c => c.id)
    expect(ids).toEqual([ '1', '2', '3', '4', '5' ])
  })
})
