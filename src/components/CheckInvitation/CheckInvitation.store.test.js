import { checkInvitation } from './CheckInvitation.store'

test('checkInvitation', () => {
  const invitationCodes = {
    invitationToken: 'invitationtoken',
    accessCode: 'accesstoken'
  }
  expect(checkInvitation(invitationCodes)).toMatchSnapshot()
})
