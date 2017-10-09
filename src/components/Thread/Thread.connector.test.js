import { mapStateToProps } from './Thread.connector'

describe('mapStateToProps', () => {
  it('returns the right keys', () => {
    const state = {
      queryResults: [],
      pending: [],
      SocketListener: {}
    }
    const props = {
      navigation: {state: {params: {id: 1}}}
    }
    const stateProps = mapStateToProps(state, props)
    expect(stateProps).toMatchSnapshot()
  })
})
