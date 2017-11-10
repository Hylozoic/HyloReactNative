import {
  mapStateToProps,
  mapDispatchToProps,
  mergeProps
} from './PostDetails.connector'
import orm from 'store/models'
import { mapValues } from 'lodash'

let props, dispatch, mergedProps, dispatchCalls, navigateCalls

beforeAll(() => {
  const session = orm.session(orm.getEmptyState())
  session.Community.create({id: '2', name: 'Home'})
  session.Post.create({id: '1', communities: ['2']})
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

  const state = {
    orm: session.state,
    CommentEditor: {
      '1': 'draft comment text'
    }
  }

  dispatchCalls = []
  navigateCalls = []

  props = {
    navigation: {
      state: {
        params: {id: '1'}
      },
      navigate: jest.fn((...args) => ['navigate', args])
    }
  }

  dispatch = jest.fn((...args) => ['dispatch', args])

  mergedProps = mergeProps(
    mapStateToProps(state, props),
    mapDispatchToProps(dispatch, props),
    props
  )
})

it('produces expected props', () => {
  expect(mergedProps).toMatchSnapshot()
})

it('sets up navigation and redux actions', () => {
  const calls = mapValues(mergedProps, (v, k) => {
    if (typeof v === 'function') return v()
  })

  expect(calls).toMatchSnapshot()
})
