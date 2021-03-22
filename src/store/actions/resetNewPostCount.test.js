import resetNewPostCount from './resetNewPostCount'

it('behaves as expected', () => {
  const groupId = 1
  const type = 'Membership'
  expect(resetNewPostCount(groupId, type)).toMatchSnapshot()
})
