import { mapStateToProps } from './MenuButton.connector'

describe('mapStateToProps', () => {
  it('returns the right keys', () => {
    expect(mapStateToProps({}, {})).toMatchSnapshot()
  })
})
