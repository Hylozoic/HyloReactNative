import { mapStateToProps, mapDispatchToProps } from './connector.js'

describe('mapStateToProps', () => {
  it('returns the right keys', () => {
    const state = {
      session: {
        loggedIn: true
      },
      pending: {
        CHECK_VERSION: true
      }
    }
    expect(mapStateToProps(state)).toMatchSnapshot()
  })
})

describe('mapDispatchToProps', () => {
  it('maps the action generators', () => {
    const dispatch = jest.fn(val => val)
    const dispatchProps = mapDispatchToProps(dispatch)
    expect(dispatchProps).toMatchSnapshot()
    dispatchProps.checkSession()
    expect(dispatch).toHaveBeenCalled()
    expect(dispatch.mock.calls).toMatchSnapshot()
  })
})
