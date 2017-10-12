import reducer, {
  MODULE_NAME,
  checkInvitation,
  createResetGoToNavAction,
  getValidInvite,
  CHECK_INVITATION
} from './CheckInvitation.store'

jest.mock('react-navigation', () => ({
  NavigationActions: {
    reset: (attribs) => attribs,
    navigate: (attribs) => attribs
  }
}))

test('checkInvitation', () => {
  const invitationCodes = {
    invitationToken: 'invitationtoken',
    accessCode: 'accesstoken'
  }
  expect(checkInvitation(invitationCodes)).toMatchSnapshot()
})

test('createResetGoToNavAction', () => {
  expect(createResetGoToNavAction('anyroutename')).toMatchSnapshot()
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
