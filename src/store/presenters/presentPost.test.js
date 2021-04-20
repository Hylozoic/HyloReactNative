import orm from 'store/models'
import presentPost from './presentPost'

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
