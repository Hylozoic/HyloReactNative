import { mapStateToProps } from './BlockedUsers.connector'

describe('mapStateToProps', () => {
  it('matches last snapshot', () => {
    const stateProps = mapStateToProps({}, {})
    expect(stateProps).toMatchSnapshot()
  })
})
