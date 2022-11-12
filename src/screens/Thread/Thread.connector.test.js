import { mapStateToProps, mapDispatchToProps } from './Thread.connector'
import { ALL_GROUP_ID } from 'store/models/Group'

jest.mock('util/websockets', () => ({
  sendIsTyping: jest.fn()
}))

jest.mock('store/selectors/getCurrentGroupId', () => () => 'public')

jest.mock('store/selectors/getCurrentUserId', () => () => {})

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
    dispatchProps.showTopic(null, ALL_GROUP_ID)('topicName')
    dispatchProps.showTopic(123)('topicName')
    expect(props.navigation.navigate.mock.calls).toMatchSnapshot()
  })
})
