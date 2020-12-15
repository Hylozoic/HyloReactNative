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

describe('mapDispatchToProps', () => {
  it('has the right keys and behavior', () => {
    const dispatch = jest.fn()
    const props = {
      navigation: {
        dispatch: jest.fn()
      }
    }
    const dispatchProps = mapDispatchToProps(dispatch, props)
    expect(dispatchProps).toMatchSnapshot()
  })
})
