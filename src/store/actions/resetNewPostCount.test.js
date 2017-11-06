import resetNewPostCount from './resetNewPostCount'

it('behaves as expected', () => {
  const communityId = 1
  const type = 'Membership'
  expect(resetNewPostCount(communityId, type)).toMatchSnapshot()
})
