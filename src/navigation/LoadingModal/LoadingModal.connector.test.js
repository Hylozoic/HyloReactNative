import { MODULE_NAME } from './LoadingModal.store'
import { mapStateToProps } from './LoadingModal.connector'

describe('mapStateToProps', () => {
  const state = {
    [MODULE_NAME]: {
      display: true
    }
  }
  it('returns the right stuff', () => expect(mapStateToProps(state)).toMatchSnapshot())
})
