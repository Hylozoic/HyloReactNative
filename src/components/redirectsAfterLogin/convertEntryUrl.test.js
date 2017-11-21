import convertEntryUrl from './convertEntryUrl'

it('handles an invitation link when logged in', () => {
  expect(convertEntryUrl('/h/use-invitation?token=foo', true))
  .toEqual('/useInvitation/foo')
})

it('handles an invitation link when logged out', () => {
  expect(convertEntryUrl('/h/use-invitation?token=foo', false))
  .toEqual('/checkInvitation/foo')
})

it('handles a community join link when logged in', () => {
  expect(convertEntryUrl('/c/sandbox/join/foo', true))
  .toEqual('/useAccessCode/sandbox/foo')
})

it('handles a community join link when logged out', () => {
  expect(convertEntryUrl('/c/sandbox/join/foo', false))
  .toEqual('/checkAccessCode/sandbox/foo')
})

it('handles a post link', () => {
  expect(convertEntryUrl('/c/sandbox/p/8190')).toEqual('/post/8190')
})

it('handles a message thread link', () => {
  expect(convertEntryUrl('/t/247')).toEqual('/thread/247')
})

it('returns an unrecognized link unchanged', () => {
  expect(convertEntryUrl('dinosaur')).toEqual('dinosaur')
})
