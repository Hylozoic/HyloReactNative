import {
  mapStateToProps,
  mergeProps
} from './PostDetails.connector'
import orm from 'store/models'

let state, props, stateProps, dispatchProps

jest.mock('store/selectors/getCurrentGroupId', () => () => 'public')

beforeAll(() => {
  const session = orm.session(orm.getEmptyState())
  session.Group.create({ id: '2', name: 'Home' })
  session.Person.create({ id: '10' })
  session.Post.create({ id: '1', groups: ['2'], creator: '10' })
  session.Attachment.create({
    id: '1',
    post: '1',
    type: 'file',
    url: 'http://foo.com/foo.pdf'
  })
  session.Attachment.create({
    id: '2',
    post: '1',
    type: 'image',
    url: 'http://foo.com/bar.png'
  })

  state = {
    orm: session.state,
    CommentEditor: {
      1: 'draft comment text'
    }
  }

  props = {
    isFocused: true,
    route: {
      params: { id: '1' }
    },
    navigation: {
      navigate: jest.fn((...args) => ['navigate', args])
    }
  }

  stateProps = {
    id: 'testpost',
    post: { id: 'testpost' },
    currentUser: { id: 'currentuser' }
  }

  dispatchProps = {
    dispatch: jest.fn((...args) => ['dispatch', args])
  }
})

it('mapsStateToProps', () => {
  expect(mapStateToProps(state, props)).toMatchSnapshot()
})

describe('mergeProps', () => {
  let mergedProps

  beforeAll(() => {
    mergedProps = mergeProps(stateProps, dispatchProps, props)
  })

  it('maps', () => {
    expect(mergedProps).toMatchSnapshot()
  })

  it('showTopic', () => {
    expect(mergedProps.showTopic('mytopicname', 4)).toMatchSnapshot()
  })

  it('showMember', () => {
    expect(mergedProps.showMember(1)).toMatchSnapshot()
  })

  it('editPost', () => {
    expect(mergedProps.editPost()).toMatchSnapshot()
  })
})
