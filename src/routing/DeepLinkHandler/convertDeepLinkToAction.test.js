// import convertDeepLinkToAction, { reformatPath } from './convertDeepLinkToAction'

// jest.mock('react-native-reanimated', () => require('react-native-reanimated/mock'))

// it('handles an invitation link', () => {
//   expect(convertDeepLinkToAction('/h/use-invitation?token=foo'))
//     .toEqual({
//       params: { token: 'foo' },
//       routeName: 'UseInvitation',
//       type: 'Navigation/NAVIGATE'
//     })
// })

// it('handles a community join link', () => {
//   expect(convertDeepLinkToAction('/c/sandbox/join/foo'))
//     .toEqual({
//       params: { accessCode: 'foo', slug: 'sandbox' },
//       routeName: 'UseAccessCode',
//       type: 'Navigation/NAVIGATE'
//     })
// })

// it('handles a post link', () => {
//   expect(convertDeepLinkToAction('/c/sandbox/p/8190')).toMatchSnapshot()
// })

// it('handles a network post link', () => {
//   expect(convertDeepLinkToAction('/n/sandbox/p/1234')).toMatchSnapshot()
// })

// it('handles an all-communities post link', () => {
//   expect(convertDeepLinkToAction('/all/p/1234')).toMatchSnapshot()
// })

// it('handles a thread link', () => {
//   expect(convertDeepLinkToAction('/t/1234')).toMatchSnapshot()
// })

// it('handles an all-communities link', () => {
//   expect(convertDeepLinkToAction('/all')).toMatchSnapshot()
// })

// it('handles a members link', () => {
//   expect(convertDeepLinkToAction('/c/hylo/members')).toMatchSnapshot()
// })

// it('handles a members index link', () => {
//   expect(convertDeepLinkToAction('/c/hylo/members')).toMatchSnapshot()
// })

// it('handles a topics index link', () => {
//   expect(convertDeepLinkToAction('/c/hylo-community-organizing/topics')).toMatchSnapshot()
// })

// it('handles a show topic link', () => {
//   expect(convertDeepLinkToAction('/c/hylo-community-organizing/topicName')).toMatchSnapshot()
// })

// it('handles a member profile link', () => {
//   expect(convertDeepLinkToAction('/m/1234')).toMatchSnapshot()
// })

// it('handles a community link', () => {
//   expect(convertDeepLinkToAction('/c/my-community')).toMatchSnapshot()
// })

// it('handles a network link', () => {
//   expect(convertDeepLinkToAction('/n/my-network')).toMatchSnapshot()
// })

// it('handles a link without a preceding slash (for tokenAuth nextURL handling)', () => {
//   expect(convertDeepLinkToAction('c/sandbox/p/8190')).toMatchSnapshot()
// })

// it('handles a message thread link', () => {
//   expect(convertDeepLinkToAction('/t/247')).toEqual({
//     params: { id: '247' },
//     routeName: 'Thread',
//     type: 'Navigation/NAVIGATE'
//   })
// })

// it('returns null for an unmatched link', () => {
//   expect(convertDeepLinkToAction('dinosaur')).toBeNull()
// })

// // reformatPath
// it('handles a password reset link', () => {
//   const loginToken = 'token'
//   const userId = 'user'
//   const nextPath = 'where/to/go'
//   const nextURL = `http://anywhere.com/${nextPath}`
//   const deepLinkURL = `/noo/login/token?t=${loginToken}&u=${userId}&n=${nextURL}`
//   // Note: Purposely unit testing reformatPath here vs convertDeepLinkToAction
//   expect(reformatPath(deepLinkURL))
//     .toEqual(
//       `passwordResetTokenLogin/${userId}/${encodeURIComponent(loginToken)}/${encodeURIComponent(nextPath)}`
//     )
// })
