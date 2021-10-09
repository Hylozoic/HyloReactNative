import fetchGroupSettings from 'fetchGroupSettings'

it('fetchGroupSettings', () => {
  expect(fetchGroupSettings(10)).toMatchSnapshot()
})
