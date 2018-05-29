import {
  mapStateToProps,
  mapDispatchToProps,
  mergeProps
} from './PostDetails.connector'
import orm from 'store/models'

let props, dispatch, state

beforeAll(() => {
  const session = orm.session(orm.getEmptyState())
  session.Community.create({id: '2', name: 'Home'})
  session.Person.create({id: '10'})
  session.Post.create({id: '1', communities: ['2'], creator: '10'})
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
      '1': 'draft comment text'
    }
  }

  props = {
    isFocused: true,
    navigation: {
      state: {
        params: {id: '1'}
      },
      navigate: jest.fn((...args) => ['navigate', args])
    }
  }

  dispatch = jest.fn((...args) => ['dispatch', args])
})

it('mapsStateToProps', () => {
  expect(mapStateToProps(state, props)).toMatchSnapshot()
})

it('mapsDispatchToProps', () => {
  expect(mapDispatchToProps(dispatch, props)).toMatchSnapshot()
})
