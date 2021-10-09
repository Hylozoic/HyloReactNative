import updateGroupSettings from 'updateGroupSettings'

it('updateGroupSettings', () => {
  expect(updateGroupSettings(123, { name: 'blah', description: 'some desc' })).toMatchSnapshot()
})
