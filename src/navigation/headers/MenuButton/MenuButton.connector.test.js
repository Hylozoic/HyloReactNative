import { mapStateToProps } from './MenuButton.connector'

jest.mock('store/selectors/getCurrentGroupId', () => () => 'public')

describe('mapStateToProps', () => {
  it('returns the right keys', () => {
    expect(mapStateToProps({}, {})).toMatchSnapshot()
  })
})
