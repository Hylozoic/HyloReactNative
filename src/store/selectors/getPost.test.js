import orm from 'store/models'
import getPost from './getPost'

describe('getPost', () => {
  it("returns null if post doesn't exist", () => {
    const session = orm.session(orm.getEmptyState())
    expect(getPost(session.state, { match: { params: { postId: '1' } } })).toEqual(undefined)
  })

  it('returns the post', () => {
    const id = 31
    const session = orm.session(orm.getEmptyState())
    session.Post.create({ id })
    const result = getPost({ orm: session.state }, { id })
    expect(result).toMatchSnapshot()
  })
})
