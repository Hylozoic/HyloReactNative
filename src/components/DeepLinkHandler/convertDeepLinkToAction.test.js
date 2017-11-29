import convertDeepLinkToAction from './convertDeepLinkToAction'

jest.mock('react-native-device-info')

it('handles an invitation link', () => {
  expect(convertDeepLinkToAction('/h/use-invitation?token=foo'))
  .toEqual({
    params: {token: 'foo'},
    routeName: 'UseInvitation',
    type: 'Navigation/NAVIGATE'
  })
})

it('handles a community join link', () => {
  expect(convertDeepLinkToAction('/c/sandbox/join/foo'))
  .toEqual({
    params: {accessCode: 'foo', slug: 'sandbox'},
    routeName: 'UseAccessCode',
    type: 'Navigation/NAVIGATE'
  })
})

it('handles a post link')
// expect(convertDeepLinkToAction('/c/sandbox/p/8190')).toEqual({

it('handles a message thread link', () => {
  expect(convertDeepLinkToAction('/t/247')).toEqual({
    params: {id: '247'},
    routeName: 'Thread',
    type: 'Navigation/NAVIGATE'
  })
})

it('returns null for an unmatched link', () => {
  expect(convertDeepLinkToAction('dinosaur')).toBeNull()
})
