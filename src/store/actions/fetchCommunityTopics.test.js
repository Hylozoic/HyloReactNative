import fetchCommunityTopics from './fetchCommunityTopics'

it('matches snapshot with communityId', () => {
  expect(fetchCommunityTopics(765, {
    subscribed: true,
    first: 7,
    offset: 3,
    sortBy: 'name',
    autocomplete: 'a'
  })).toMatchSnapshot()
})

it('matches snapshot without communityId', () => {
  expect(fetchCommunityTopics(null, {})).toMatchSnapshot()
})
