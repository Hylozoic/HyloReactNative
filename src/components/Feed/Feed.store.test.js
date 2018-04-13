import {
  fetchCommunityTopic,
  setTopicSubscribe,
  getCommunitySearchObject,
  getNetworkSearchObject
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

describe('getCommunitySearchObject', () => {
  it('it returns the correct value with a communitySlug', () => {
    const communityId = '1'
    const communitySlug = 'my-community'
    const expected = {slug: communitySlug}
    expect(getCommunitySearchObject(communityId, communitySlug)).toEqual(expected)
  })

  it('it returns the correct value without a communitySlug', () => {
    const communityId = undefined
    const communitySlug = 'my-community'
    const expected = {slug: communitySlug}
    expect(getCommunitySearchObject(communityId, communitySlug)).toEqual(expected)
  })
})

describe('getNetworkSearchObject', () => {
  it('returns the correct value with a networkId', () => {
    const networkId = '1'
    const networkSlug = 'my-network'
    const expected = {slug: networkSlug}
    expect(getNetworkSearchObject(networkId, networkSlug)).toEqual(expected)
  })

  it('returns the correct value without a networkId', () => {
    const networkId = undefined
    const networkSlug = 'my-network'
    const expected = {slug: networkSlug}
    expect(getNetworkSearchObject(networkId, networkSlug)).toEqual(expected)
  })
})
