import {
  fetchCommunitySettings,
  updateCommunitySettings
} from './CommunitySettings.store'

it('fetchCommunitySettings', () => {
  expect(fetchCommunitySettings(10)).toMatchSnapshot()
})

it('updateCommunitySettings', () => {
  expect(updateCommunitySettings(123, {name: 'blah', description: 'some desc'})).toMatchSnapshot()
})
