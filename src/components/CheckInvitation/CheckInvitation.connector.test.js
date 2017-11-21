import {
  mapStateToProps,
  mapDispatchToProps,
  handleCheckInvitation,
  mergeProps
} from './CheckInvitation.connector'

test('mapStateToProps matches the latest snapshot', () => {
  const props = {
    navigation: {
      navigate: attrs => attrs,
      dispatch: attrs => attrs,
      state: {
        params: {
          token: 'anytoken',
          invitationToken: 'anyinvitationtoken',
          accessCode: 'anyaccesscode'
        }
      }
    }
  }
  expect(mapStateToProps({}, props)).toMatchSnapshot()
})

test('mapDispatchToProps matches the last snapshot', () =>
  expect(mapDispatchToProps).toMatchSnapshot()
)

describe('handleCheckInvitation', () => {
  const checkInvitationResponse = (valid) => ({
    payload: {
      data: {
        checkInvitation: {
          valid
        }
      }
    }
  })

  it('should forward to signup page if invite is valid', () => {
    const stateProps = {
      invitationCodes: {},
      navToSignup: jest.fn(),
      navToInviteExpired: jest.fn()
    }
    const dispatchProps = {
      checkInvitation: () =>
        Promise.resolve(checkInvitationResponse(true))
    }
    return handleCheckInvitation(stateProps, dispatchProps)
    .then(() => {
      expect(stateProps.navToInviteExpired).not.toHaveBeenCalled()
      return expect(stateProps.navToSignup).toHaveBeenCalled()
    })
  })

  it('should forward to invite expired page if invite is invalid', () => {
    const stateProps = {
      invitationCodes: {},
      navToSignup: jest.fn(),
      navToInviteExpired: jest.fn()
    }
    const dispatchProps = {
      checkInvitation: () =>
        Promise.resolve(checkInvitationResponse(false))
    }
    return handleCheckInvitation(stateProps, dispatchProps)
    .then(() => {
      expect(stateProps.navToSignup).not.toHaveBeenCalled()
      return expect(stateProps.navToInviteExpired).toHaveBeenCalled()
    })
  })

  it('should forward to signup page if an error occurs in checking the invite', () => {
    const stateProps = {
      invitationCodes: {},
      navToSignup: jest.fn(),
      navToInviteExpired: jest.fn()
    }
    const dispatchProps = {
      checkInvitation: () => Promise.reject(new Error('anything'))
    }
    return handleCheckInvitation(stateProps, dispatchProps)
    .then(() => {
      expect(stateProps.navToInviteExpired).not.toHaveBeenCalled()
      return expect(stateProps.navToSignup).toHaveBeenCalled()
    })
  })
})

test('mergeProps matches the last snapshot', () => {
  const stateProps = {
    stateProp1: 'stateProp1'
  }
  const dispatchProps = {
    dispatchProp1: 'dispatchProp1'
  }
  const ownProps = {
    ownProp1: 'ownProp1'
  }
  const result = mergeProps(stateProps, dispatchProps, ownProps)
  expect(result).toMatchSnapshot()
})
