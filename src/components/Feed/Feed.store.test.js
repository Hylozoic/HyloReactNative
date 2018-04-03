import {
  fetchCommunityTopic,
  setTopicSubscribe
} from './Feed.store'

it('matches snapshot for fetchCommunityTopic', () => {
  const topicName = 'news'
  const communitySlug = 'my-community'
  expect(fetchCommunityTopic(topicName, communitySlug)).toMatchSnapshot()
})

it('matches snapshot for setTopicSubscribe', () => {
  const topicId = 1
  const communityId = 2
  const isSubscribing = true
  expect(setTopicSubscribe(topicId, communityId, isSubscribing)).toMatchSnapshot()
})
