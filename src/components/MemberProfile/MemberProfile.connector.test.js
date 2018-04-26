import { mapStateToProps, mapDispatchToProps, makeOnPressMessages, mergeProps } from './MemberProfile.connector'
import { FETCH_PERSON } from './MemberProfile.store'

describe('mapStateToProps', () => {
  it('maps the state to the props', () => {
    const id = 123
    const navigation = {
      state: {params: {id}},
      navigate: jest.fn()
    }
    const state = { pending: { [FETCH_PERSON]: null } }
    const props = mapStateToProps(state, {navigation})
    expect(props).toMatchSnapshot()
    props.goToDetails()
    expect(navigation.navigate).toHaveBeenCalledWith({
      'key': 'MemberDetails',
      'params': {id},
      'routeName': 'MemberDetails'
    })
    navigation.navigate.mockClear()
    props.goToEdit()
    expect(navigation.navigate).toHaveBeenCalledWith({
      'key': 'MemberDetails',
      'params': {id, editing: true},
      'routeName': 'MemberDetails'
    })
  })
})

describe('mapDispatchToProps', () => {
  it('returns the right keys', () => {
    const props = {
      navigation: {navigate: jest.fn()}
    }
    expect(mapDispatchToProps({}, props)).toMatchSnapshot()
  })
})

describe('makeOnPressMessages', () => {
  var navigation

  beforeEach(() => {
    navigation = {
      navigate: jest.fn()
    }
  })

  it("navigates to thread list when it's your profile", () => {
    const onPressMessages = makeOnPressMessages({id: 1}, {id: 1}, navigation)
    onPressMessages()
    expect(navigation.navigate).toHaveBeenCalledWith({
      'key': 'ThreadList',
      'routeName': 'ThreadList'
    })
  })

  it('navigates to existing thread when there is one', () => {
    const messageThreadId = 99
    const onPressMessages = makeOnPressMessages({id: 1}, {id: 2, messageThreadId}, navigation)
    onPressMessages()
    expect(navigation.navigate).toHaveBeenCalledWith({
      'key': 'Thread',
      'params': {id: messageThreadId},
      'routeName': 'Thread'
    })
  })

  it('navigates to new message page when there is no existing thread', () => {
    const otherPersonId = 2
    const onPressMessages = makeOnPressMessages({id: 1}, {id: otherPersonId}, navigation)
    onPressMessages()
    expect(navigation.navigate).toHaveBeenCalledWith({
      'key': 'NewMessage',
      'params': {'participants': [otherPersonId]},
      'routeName': 'NewMessage'
    })
  })
})

describe('mergeProps', () => {
  it('returns the right keys', () => {
    const id = 78
    const stateProps = {
      currentUser: {id: 1},
      person: {id},
      id,
      isMe: true
    }
    const dispatchProps = {
      fetchPerson: jest.fn(),
      updateUserSettings: jest.fn()
    }
    const ownProps = {
      navigation: {
        navigate: () => {}
      }
    }
    const mergedProps = mergeProps(stateProps, dispatchProps, ownProps)
    expect(mergedProps).toMatchSnapshot()
    mergedProps.fetchPerson()
    expect(dispatchProps.fetchPerson).toHaveBeenCalledWith(id)
    const changes = {name: 'bob'}
    mergedProps.updateUserSettings(changes)
    expect(dispatchProps.updateUserSettings).toHaveBeenCalledWith(changes)
  })

  it('sets updateUserSettings to no-op if isMe is false', () => {
    const stateProps = {
      isMe: false
    }
    const dispatchProps = {
      updateUserSettings: jest.fn()
    }
    const mergedProps = mergeProps(stateProps, dispatchProps, {})
    const changes = {name: 'bob'}
    mergedProps.updateUserSettings(changes)
    expect(dispatchProps.updateUserSettings).not.toHaveBeenCalledWith(changes)
  })
})
