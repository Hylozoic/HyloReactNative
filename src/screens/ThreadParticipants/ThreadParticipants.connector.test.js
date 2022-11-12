import { modalScreenName } from 'navigation/linking/helpers'
import { mapStateToProps } from './ThreadParticipants.connector'

jest.mock('store/selectors/getCurrentUserId', () => () => 'mockId')

describe('mapStateToProps', () => {
  it('returns the right keys', () => {
    const props = {
      route: {
        params: { id: 1 }
      },
      navigation: {
        navigate: jest.fn()
      }
    }
    const stateProps = mapStateToProps({}, props)
    expect(stateProps).toMatchSnapshot()
    stateProps.goToParticipant(1)
    expect(props.navigation.navigate).toHaveBeenCalledWith(modalScreenName('Member'), { id: 1 })
  })
})
