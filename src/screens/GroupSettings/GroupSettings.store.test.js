import {
  fetchGroupSettings,
  updateGroupSettings
} from './GroupSettings.store'

it('fetchGroupSettings', () => {
  expect(fetchGroupSettings(10)).toMatchSnapshot()
})

it('updateGroupSettings', () => {
  expect(updateGroupSettings(123, { name: 'blah', description: 'some desc' })).toMatchSnapshot()
})
