import { useInvitation } from './JoinGroup.store'

test('useInvitation', () => {
  const invitationCodes = {
    invitationToken: 'invitationtoken',
    accessCode: 'accesstoken'
  }
  expect(useInvitation(invitationCodes)).toMatchSnapshot()
})
