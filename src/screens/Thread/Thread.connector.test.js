import { mapStateToProps, mapDispatchToProps, mergeProps } from './Thread.connector'
import { ALL_COMMUNITIES_ID } from 'routing/helpers'

jest.mock('util/websockets', () => ({
  sendIsTyping: jest.fn()
}))

describe('mapStateToProps', () => {
  it('returns the right keys', () => {
    const state = {
      queryResults: [],
      pending: [],
      SocketListener: {}
    }
    const props = {
      route: {
        params: { id: 1 }
      },
      navigation: {}
    }
    const stateProps = mapStateToProps(state, props)
    expect(stateProps).toMatchSnapshot()
  })
})

describe('mapDispatchToProps', () => {
  it('creates actions', () => {
    const dispatch = jest.fn()
    const props = {
      route: {
        params: { id: 77 }
      },
      navigation: {
        navigate: jest.fn()
      }
    }
    const dispatchProps = mapDispatchToProps(dispatch, props)
    expect(dispatchProps).toMatchSnapshot()
    dispatchProps.createMessage('some text')
    dispatchProps.fetchMessages(3)
    dispatchProps.reconnectFetchMessages()
    dispatchProps.sendIsTyping()
    dispatchProps.updateThreadReadTime()
    expect(dispatch.mock.calls).toMatchSnapshot()
    dispatchProps.showTopic(ALL_COMMUNITIES_ID)('topicName')
    dispatchProps.showTopic(123)('topicName')
    expect(props.navigation.navigate.mock.calls).toMatchSnapshot()
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
    const communityId = 123
    const networkId = 456
    const stateProps = {
      id: 12,
      title: 'Jon and 3 others',
      communityId,
      networkId
    }
    const dispatchProps = {
      showTopic: jest.fn()
    }
    const mergedProps = mergeProps(stateProps, dispatchProps, ownProps)
    expect(dispatchProps.showTopic).toHaveBeenCalledWith(communityId, networkId)
    mergedProps.setNavParams()
    expect(setParams).toHaveBeenCalled()
    const { title, onPressTitle } = setParams.mock.calls[0][0]
    expect(title).toEqual(stateProps.title)
    onPressTitle()
    expect(navigate).toHaveBeenCalledWith('ThreadParticipants', { id: stateProps.id })
  })
})