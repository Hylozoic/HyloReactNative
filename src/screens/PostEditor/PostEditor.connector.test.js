import { mapStateToProps, mapDispatchToProps } from './PostEditor.connector'
import orm from 'store/models'

const groupId = 1
const id = 1
const details = 'details'
let group1, group2
let props, state

describe('PostEditor mapStateToProps', () => {
  beforeEach(() => {
    const session = orm.session(orm.getEmptyState())
    group1 = session.Group.create({ id: '7' })
    session.Me.create({
      id: '10',
      memberships: [session.Membership.create({
        id: '345',
        group: group1.id,
        hasModeratorRole: true
      })]
    })
    session.Person.create({ id: '10' })

    group2 = session.Group.create({ id: '8' })
    session.Post.create({ id: '1', groups: [group1.id, '8'], creator: '10' })
    session.Attachment.create({
      id: '2', post: '1', type: 'image', url: 'foo.png', position: 1
    })
    session.Attachment.create({
      id: '3', post: '1', type: 'image', url: 'bar.png', position: 0
    })
    state = {
      orm: session.state,
      pending: {},
      PostEditor: {
        details
      }
    }
    props = {
      route: {
        params: {
          groupId,
          id
        }
      },
      navigation: {
        goBack: jest.fn()
      }
    }
  })

  it('maps', () => {
    expect(mapStateToProps(state, props)).toMatchSnapshot()
  })

  it('returns groups', () => {
    expect(mapStateToProps(state, props).post.groups).toEqual([group1.ref, group2.ref])
  })

  it('returns a post', () => {
    expect(mapStateToProps(state, props).post).toBeDefined()
  })

  it('sets groups and imageUrls from post', () => {
    const stateProps = mapStateToProps(state, props)
    expect(stateProps.post.groups).toEqual([group1.ref, group2.ref])
    expect(stateProps.imageUrls).toEqual(['bar.png', 'foo.png'])
  })
})

describe('PostEditor mapDispatchToProps', () => {
  it('maps the action generators', () => {
    const dispatch = jest.fn(val => val)
    const props = {
      route: {
        params: {
          groupId,
          id
        }
      },
      navigation: {
        goBack: jest.fn()
      }
    }
    const dispatchProps = mapDispatchToProps(dispatch, props)
    expect(dispatchProps).toMatchSnapshot()
    dispatchProps.fetchPost(1)
    expect(dispatch).toHaveBeenCalled()
    expect(dispatch.mock.calls).toMatchSnapshot()
  })

  it('calls save correctly', async () => {
    expect.assertions(6)
    const props = {
      route: {
        params: {
          groupId,
          id
        }
      },
      navigation: {
        goBack: jest.fn()
      }
    }
    const dispatch = jest.fn(val => Promise.resolve(val))
    const dispatchProps = mapDispatchToProps(dispatch, props)
    expect(dispatchProps).toMatchSnapshot()

    const postData = {
      title: '',
      groups: []
    }

    await expect(dispatchProps.save(postData)).rejects.toHaveProperty('message', 'Title cannot be blank')

    postData.title = 'a title'
    await expect(dispatchProps.save(postData)).rejects.toHaveProperty('message', 'You must select a group')

    postData.groups = [{ id: 1 }]
    await expect(dispatchProps.save(postData)).resolves.toBeDefined()

    expect(dispatch).toHaveBeenCalled()
    expect(dispatch.mock.calls).toMatchSnapshot()
  })
})
