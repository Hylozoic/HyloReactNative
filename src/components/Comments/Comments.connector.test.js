import { mapStateToProps } from './Comments.connector'
import { FETCH_COMMENTS } from 'store/constants'

describe('mapStateToProps', () => {
  it('sets pending correctly', () => {
    const props = {
      pending: {
        Control: true
      },
      queryResults: {}
    }
    expect(mapStateToProps(props, {}).pending).toEqual(undefined)
    expect(mapStateToProps({
      ...props,
      pending: { [FETCH_COMMENTS]: true }
    }, {}).pending).toEqual(true)
  })
})
