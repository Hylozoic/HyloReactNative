import { MODULE_NAME } from './LoadingModal.store'
import { mapStateToProps } from './LoadingModal.connector'

describe('mapStateToProps', () => {
  const state = {
    [MODULE_NAME]: {}
  }
  it('returns the right keys', () => expect(mapStateToProps(state)).toMatchSnapshot())
})
