import orm from 'store/models'
import { makeMapStateToProps } from './PostRow.connector'

describe('makeMapStateToProps', () => {
  let state

  beforeEach(() => {
    const session = orm.session(orm.getEmptyState())
    const postId = '10'

    session.Community.create({ id: '1' })
    session.Topic.create({ id: '2', slug: 'slugger', name: 'namer' })
    session.Person.create({ id: '3', avatarUrl: 'someUrl', name: 'foo' })
    session.Attachment.create({
      post: postId,
      id: '33',
      type: 'image',
      url: 'someImageUrl'
    })
    session.PostMembership.create({
      id: '333',
      community: '1',
      pinned: true
    })

    session.Post.create({
      id: postId,
      creator: '3',
      communities: ['1'],
      topics: ['2'],
      commenters: ['3'],
      postMemberships: ['333']
    })

    state = {
      orm: session.state
    }
  })

  it('returns null when postId not defined in ORM', () => {
    const mapStateToProps = makeMapStateToProps()
    expect(mapStateToProps(state, { postId: 100000 })).toEqual(
      {
        commenters: null,
        communities: null,
        creator: null,
        imageUrls: null,
        isPinned: null,
        post: null,
        topics: null
      }
    )
  })

  it('returns post and attributes', () => {
    const mapStateToProps = makeMapStateToProps()
    expect(mapStateToProps(state, { postId: 10, communityId: 1 })).toEqual(
      {
        commenters: [{ avatarUrl: 'someUrl', id: '3', name: 'foo' }],
        communities: [{ id: '1' }],
        creator: { avatarUrl: 'someUrl', id: '3', name: 'foo' },
        isPinned: true,
        imageUrls: ['someImageUrl'],
        post: { creator: '3', id: '10' },
        topics: [{ id: '2', name: 'namer', slug: 'slugger' }]
      }
    )
  })
})