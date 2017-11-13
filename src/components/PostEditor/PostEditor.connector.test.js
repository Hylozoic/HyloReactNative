import { mapStateToProps, mapDispatchToProps } from './PostEditor.connector'
import orm from 'store/models'

const communityId = 1
const id = 1
const details = 'details'
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
const state = {
  PostEditor: {
    details
  }
}

describe('PostEditor mapStateToProps', () => {
  it('returns communityIds', () => {
    expect(mapStateToProps(state, props).communityIds).toEqual([communityId])
  })

  it('returns details', () => {
    expect(mapStateToProps(state, props).details).toBe(details)
  })

  it('returns a post', () => {
    expect(mapStateToProps(state, props).post).toBeDefined()
  })

  it('sets communityIds and imageUrls from post', () => {
    const session = orm.session(orm.getEmptyState())
    session.Community.create({id: '7'})
    session.Community.create({id: '8'})
    session.Post.create({id: '1', communities: ['7', '8']})
    session.Attachment.create({
      id: '2', post: '1', type: 'image', url: 'foo.png', position: 1
    })
    session.Attachment.create({
      id: '3', post: '1', type: 'image', url: 'bar.png', position: 0
    })
    const state = {
      orm: session.state,
      PostEditor: {
        details: ''
      }
    }
    const props = {
      navigation: {
        state: {
          params: {id: '1'}
        }
      }
    }
    const stateProps = mapStateToProps(state, props)
    expect(stateProps.communityIds).toEqual(['7', '8'])
    expect(stateProps.imageUrls).toEqual(['bar.png', 'foo.png'])
  })
})

describe('PostEditor mapDispatchToProps', () => {
  it('maps the action generators', () => {
    const dispatch = jest.fn(val => val)
    const dispatchProps = mapDispatchToProps(dispatch, props)
    expect(dispatchProps).toMatchSnapshot()
    dispatchProps.setDetails('details')
    expect(dispatch).toHaveBeenCalled()
    expect(dispatch.mock.calls).toMatchSnapshot()
  })

  it('calls save correctly', async () => {
    expect.assertions(6)

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
