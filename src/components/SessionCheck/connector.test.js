import { mapStateToProps } from './connector.js'

describe('mapStateToProps', () => {
  it('returns the right keys', () =>
    expect(mapStateToProps({session: {loggedIn: true}})).toMatchSnapshot())
})
