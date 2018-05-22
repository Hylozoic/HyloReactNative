import { mapStateToProps, mapDispatchToProps } from './SearchPage.connector'

describe('mapStateToProps', () => {
  it('matches last snapshot', () => {
    const stateProps = mapStateToProps({}, {})
    expect(stateProps).toMatchSnapshot()
  })
})

describe('mapDispatchToProps', () => {
  it('matches last snapshot', () => {
    const dispatchProps = mapDispatchToProps(() => {}, {})
    expect(dispatchProps).toMatchSnapshot()
  })
})
