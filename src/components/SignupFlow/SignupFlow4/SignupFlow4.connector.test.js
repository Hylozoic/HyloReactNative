import { mapStateToProps } from './SignupFlow4.connector'

describe('mapStateToProps', () => {
  it('sets up goToNext', () => {
    const props = {
      navigation: {
        navigate: jest.fn()
      }
    }
    const stateProps = mapStateToProps({}, props)
    stateProps.goToNext()
    expect(props.navigation.navigate).toHaveBeenCalledWith('SignupFlow5')
  })
})
