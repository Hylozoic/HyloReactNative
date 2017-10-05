import { mapStateToProps, mapDispatchToProps } from './SessionCheck.connector.js'

describe('mapStateToProps', () => {
  it('returns the right keys', () =>
    expect(mapStateToProps({session: {loggedIn: true}})).toMatchSnapshot())
})

describe('mapDispatchToProps', () => {
  it('maps the action generators', () => {
    const dispatch = jest.fn(val => val)
    const dispatchProps = mapDispatchToProps(dispatch)
    expect(dispatchProps).toMatchSnapshot()
    dispatchProps.actions.checkSession()
    expect(dispatch).toHaveBeenCalled()
    expect(dispatch.mock.calls).toMatchSnapshot()
  })
})
