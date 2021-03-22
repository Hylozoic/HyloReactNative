import {
  fetchGroupTopic,
  setTopicSubscribe
} from './Feed.store'

it('matches snapshot for fetchGroupTopic', () => {
  const topicName = 'news'
  const groupSlug = 'my-group'
  expect(fetchGroupTopic(topicName, groupSlug)).toMatchSnapshot()
})

it('matches snapshot for setTopicSubscribe', () => {
  const topicId = 1
  const groupId = 2
  const isSubscribing = true
  expect(setTopicSubscribe(topicId, groupId, isSubscribing)).toMatchSnapshot()
})
