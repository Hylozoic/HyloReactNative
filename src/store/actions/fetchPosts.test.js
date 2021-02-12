import fetchPosts from './fetchPosts'

it('sets updateLastViewed to true when fetching for a group', () => {
  expect(fetchPosts()).toMatchSnapshot()
})

it('passes a reset option', () => {
  const action = fetchPosts({ slug: 'foo' }, { reset: true })
  expect(action.meta.extractQueryResults.reset).toBeTruthy()
})
