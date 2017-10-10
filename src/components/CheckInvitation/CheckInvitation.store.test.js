import reducer, {
  MODULE_NAME,
  checkInvitation,
  getValidInvite,
  CHECK_INVITATION
} from './CheckInvitation.store'

test('checkInvitation', () => {
  const invitationCodes = {
    invitationToken: 'invitationtoken',
    accessCode: 'accesstoken'
  }
  expect(checkInvitation(invitationCodes)).toMatchSnapshot()
})

test('getValidInvite', () => {
  const testState = {
    [MODULE_NAME]: {
      valid: 'a unique value'
    }
  }
  expect(getValidInvite(testState)).toEqual(testState[MODULE_NAME].valid)
})

test(`reducer ${CHECK_INVITATION}`, () => {
  const checkInvitationData = {
    stuff1: 1,
    stuff2: 2
  }
  const testAction = {
    type: CHECK_INVITATION,
    payload: {
      data: {
        checkInvitation: checkInvitationData
      }
    }
  }
  expect(reducer({}, testAction)).toEqual(checkInvitationData)
})
