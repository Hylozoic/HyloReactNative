import { MODULE_NAME } from './CheckInvitation.store'
import {
  mapStateToProps,
  mapDispatchToProps
} from './CheckInvitation.connector'

describe('mapStateToProps', () => {
  it('maps the state... to the props', () => {
    const state = {
      pending: {},
      [MODULE_NAME]: {
        valid: true
      }
    }
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
    expect(mapStateToProps(state, props)).toMatchSnapshot()
  })
})

describe('mapDispatchToProps', () => {
  it('matches the last snapshot', () => {
    expect(mapDispatchToProps)
    .toMatchSnapshot()
  })
})
