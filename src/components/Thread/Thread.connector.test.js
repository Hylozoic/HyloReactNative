import { mapStateToProps, mapDispatchToProps, mergeProps } from './Thread.connector'

jest.mock('react-native-device-info')

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

describe('mapDispatchToProps', () => {
  it('creates actions', () => {
    const dispatch = jest.fn()
    const props = {
      navigation: {state: {params: {id: 77}}}
    }
    const dispatchProps = mapDispatchToProps(dispatch, props)
    expect(dispatchProps).toMatchSnapshot()
    dispatchProps.createMessage('some text')
    dispatchProps.fetchMessages(3)
    dispatchProps.reconnectFetchMessages()
    dispatchProps.sendIsTyping()
    dispatchProps.updateThreadReadTime()
    expect(dispatch.mock.calls).toMatchSnapshot()
  })
})

describe('mergeProps', () => {
  it('creates setNavParams when title is defined', () => {
    const setParams = jest.fn()
    const navigate = jest.fn()
    const ownProps = {
      navigation: {
        setParams,
        navigate
      }
    }
    const stateProps = {
      id: 12,
      title: 'Jon and 3 others'
    }
    const mergedProps = mergeProps(stateProps, {}, ownProps)
    mergedProps.setNavParams()
    expect(setParams).toHaveBeenCalled()
    const { title, onPressTitle } = setParams.mock.calls[0][0]
    expect(title).toEqual(stateProps.title)
    onPressTitle()
    expect(navigate).toHaveBeenCalledWith('ThreadParticipants', {id: stateProps.id})
  })
})
