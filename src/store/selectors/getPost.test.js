import orm from 'store/models'
import getPost, { presentPost } from './getPost'

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

describe('presentPost', () => {
  const groupId = 121
  const postId = 324
  const session = orm.session(orm.getEmptyState())

  const group = session.Group.create({ id: groupId })
  session.Person.create({ id: '10' })
  const postMembership = session.PostMembership.create({ group, pinned: true })
  session.Post.create({ id: postId, postMemberships: [postMembership], creator: '10' })

  it('matches the snapshot', () => {
    const post = session.Post.withId(postId)
    const result = presentPost(post, groupId)
    expect(result).toMatchSnapshot()
  })
})
