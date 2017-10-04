import { mapDispatchToProps, mapStateToProps } from './Login.connector'

const dispatch = jest.fn(x => x)
const props = {}
const dispatchProps = mapDispatchToProps(dispatch, props)
const token = 'SOME_TOKEN'

describe('Login dispatchProps', () => {
  it('loginWithFacebook should match the latest snapshot', () => {
    expect(dispatchProps.loginWithFacebook(token)).toMatchSnapshot()
  })

  it('loginWithGoogle should match the latest snapshot', () => {
    expect(dispatchProps.loginWithGoogle(token)).toMatchSnapshot()
  })

  it('login should match the latest snapshot', () => {
    const username = 'name'
    const password = 'pass'
    expect(dispatchProps.login(username, password)).toMatchSnapshot()
  })

  it('maps the action generators', () => {
    const dispatch = jest.fn(val => val)
    const dispatchProps = mapDispatchToProps(dispatch)
    expect(dispatchProps).toMatchSnapshot()
    dispatchProps.loginWithFacebook('token')
    expect(dispatch).toHaveBeenCalled()
    expect(dispatch.mock.calls).toMatchSnapshot()
  })

  // it('returns the right keys', () => {
  //   const state = {
  //     session: {
  //       loginError: 'blah',
  //       defaultLoginEmail: 'lah@lah.com'
  //     }
  //   }
  //   const props = {
  //     navigation: {
  //       navigate: jest.fn()
  //     }
  //   }
  //   const newProps = mapStateToProps(state, props)
  //   expect(newProps).toMatchSnapshot()
  //   newProps.goToSignup()
  //   expect(props.navigation.navigate).toHaveBeenCalled()
  //   expect(props.navigation.navigate.mock.calls)
  //   .toMatchSnapshot()
  // })
})

describe('Login mapStateToProps', () => {
  it('returns a default email from the session', () => {
    const email = 'email@hylo.com'
    const state = {
      session: {
        defaultLoginEmail: email
      },
      pending: {}
    }
    expect(mapStateToProps(state, props).defaultEmail).toBe(email)
  })
  describe('with email error', () => {
    it('emailError is true', () => {
      const error = 'email error'

      const state = {
        session: {
          loginError: error
        },
        pending: {}
      }
      expect(mapStateToProps(state, props).emailError).toBe(true)
    })
  })
  describe('with password error', () => {
    it('passwordError is true', () => {
      const error = 'password error'

      const state = {
        session: {
          loginError: error
        },
        pending: {}
      }
      expect(mapStateToProps(state, props).passwordError).toBe(true)
    })
  })
  describe('pending', () => {
    it('to be truthy if pending', () => {
      const LOGIN = 'LOGIN'

      const state = {
        session: {},
        pending: {
          LOGIN
        }
      }
      expect(mapStateToProps(state, props).pending).toBeTruthy()
    })
    it('to be falsey if not pending', () => {
      const state = {
        session: {},
        pending: {}
      }
      expect(mapStateToProps(state, props).pending).toBeFalsy()
    })
  })
})
