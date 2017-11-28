import fetchPosts from './fetchPosts'

it('rejects a bad subject value', () => {
  expect(() => {
    fetchPosts({subject: 'foo'})
  }).toThrow('FETCH_POSTS with subject=foo is not implemented')
})

it('passes a reset option', () => {
  const action = fetchPosts({subject: 'community', slug: 'foo'}, {reset: true})
  expect(action.meta.extractQueryResults.reset).toBeTruthy()
})

it('constructs a network fetchPosts action', () => {
  const action = fetchPosts({subject: 'network'})
  expect(action).toMatchSnapshot()
})
