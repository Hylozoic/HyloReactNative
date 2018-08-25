import { mapStateToProps, mapDispatchToProps } from './PostEditor.connector'
import orm from 'store/models'

const communityId = 1
const id = 1
const details = 'details'
let community1, community2
let props, state

describe('PostEditor mapStateToProps', () => {
  beforeEach(() => {
    const session = orm.session(orm.getEmptyState())
    community1 = session.Community.create({id: '7'})
    session.Me.create({
      id: '10',
      memberships: [session.Membership.create({
        id: '345',
        community: community1.id,
        hasModeratorRole: true
      })]})
    session.Person.create({id: '10'})

    community2 = session.Community.create({id: '8'})
    session.Post.create({id: '1', communities: [community1.id, '8'], creator: '10'})
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
      navigation: {
        goBack: jest.fn(),
        state: {
          params: {
            communityId,
            id
          }
        }
      }
    }
  })

  it('maps', () => {
    expect(mapStateToProps(state, props)).toMatchSnapshot()
  })

  it('returns communityIds', () => {
    expect(mapStateToProps(state, props).communityIds).toEqual([community1.id, community2.id])
  })

  it('returns a post', () => {
    expect(mapStateToProps(state, props).post).toBeDefined()
  })

  it('sets communityIds and imageUrls from post', () => {
    const stateProps = mapStateToProps(state, props)
    expect(stateProps.communityIds).toEqual([community1.id, community2.id])
    expect(stateProps.imageUrls).toEqual(['bar.png', 'foo.png'])
  })
})

describe('PostEditor mapDispatchToProps', () => {
  it('maps the action generators', () => {
    const dispatch = jest.fn(val => val)
    const props = {
      navigation: {
        goBack: jest.fn(),
        state: {
          params: {
            communityId,
            id
          }
        }
      }
    }
    const dispatchProps = mapDispatchToProps(dispatch, props)
    expect(dispatchProps).toMatchSnapshot()
    dispatchProps.fetchDetailsText(1)
    expect(dispatch).toHaveBeenCalled()
    expect(dispatch.mock.calls).toMatchSnapshot()
  })

  it('calls save correctly', async () => {
    expect.assertions(6)
    const props = {
      navigation: {
        goBack: jest.fn(),
        state: {
          params: {
            communityId,
            id
          }
        }
      }
    }
    const dispatch = jest.fn(val => Promise.resolve(val))
    const dispatchProps = mapDispatchToProps(dispatch, props)
    expect(dispatchProps).toMatchSnapshot()

    let postData = {
      title: '',
      communities: []
    }

    await expect(dispatchProps.save(postData)).rejects.toHaveProperty('message', 'Title cannot be blank')

    postData.title = 'a title'
    await expect(dispatchProps.save(postData)).rejects.toHaveProperty('message', 'You must select a community')

    postData.communities = [{id: 1}]
    await expect(dispatchProps.save(postData)).resolves.toBeDefined()

    expect(dispatch).toHaveBeenCalled()
    expect(dispatch.mock.calls).toMatchSnapshot()
  })
})
