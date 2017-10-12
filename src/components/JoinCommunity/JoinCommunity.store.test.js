import reducer, {
  MODULE_NAME,
  USE_INVITATION,
  useInvitation,
  getNewMembership
} from './JoinCommunity.store'

test('useInvitation', () => {
  const invitationCodes = {
    invitationToken: 'invitationtoken',
    accessCode: 'accesstoken'
  }
  expect(useInvitation(invitationCodes)).toMatchSnapshot()
})

test('getNewMembership', () => {
  const membership = {id: 'anyid'}
  const testState = {
    [MODULE_NAME]: {
      membership
    }
  }
  expect(getNewMembership(testState)).toEqual(membership)
})

test(`reducer ${USE_INVITATION}`, () => {
  const useInvitationData = {stuff1: 1, stuff2: 2}
  const testAction = {
    type: USE_INVITATION,
    payload: {
      data: {
        useInvitation: useInvitationData
      }
    }
  }
  expect(reducer({}, testAction)).toEqual(useInvitationData)
})
