import { mapStateToProps, mapDispatchToProps } from './UserSettings.connector'

describe('mapStateToProps', () => {
  it('sets up cancel', () => {
    const props = {
      navigation: {
        goBack: jest.fn()
      }
    }
    const stateProps = mapStateToProps({}, props)
    expect(stateProps).toMatchSnapshot()
    stateProps.cancel()
    expect(props.navigation.goBack).toHaveBeenCalled()
  })
})
