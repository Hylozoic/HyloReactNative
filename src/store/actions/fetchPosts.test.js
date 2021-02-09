import fetchPosts from './fetchPosts'

it('rejects a bad subject value', () => {
  expect(() => {
    fetchPosts({ subject: 'foo' })
  }).toThrow('FETCH_POSTS with subject=foo is not implemented')
})

it('sets updateLastViewed to true when fetching for a group', () => {
  expect(fetchPosts({ subject: 'group' })).toMatchSnapshot()
})

it('passes a reset option', () => {
  const action = fetchPosts({ subject: 'group', slug: 'foo' }, { reset: true })
  expect(action.meta.extractQueryResults.reset).toBeTruthy()
})

it('constructs a network fetchPosts action', () => {
  const action = fetchPosts({ subject: 'network' })
  expect(action).toMatchSnapshot()
})

it('constructs a project fetchPosts action', () => {
  const action = fetchPosts({ subject: 'project' })
  expect(action).toMatchSnapshot()
})
