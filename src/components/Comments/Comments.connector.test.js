import { mapStateToProps } from './Comments.connector'
import { FETCH_COMMENTS } from './Comments.store'
import { FETCH_POST } from '../../store/actions/fetchPost'

describe('mapStateToProps', () => {
  it('sets pending correctly', () => {
    const props = {
      pending: {
        Control: true
      },
      queryResults: {}
    }
    expect(mapStateToProps(props, {}).pending).toEqual(undefined)
    expect(mapStateToProps(props, {postPending: true}).pending).toEqual(true)
    expect(mapStateToProps({
      ...props,
      pending: {[FETCH_COMMENTS]: true}
    }, {}).pending).toEqual(true)
    expect(mapStateToProps({
      ...props,
      pending: {[FETCH_POST]: true}
    }, {}).pending).toEqual(true)
  })
})
