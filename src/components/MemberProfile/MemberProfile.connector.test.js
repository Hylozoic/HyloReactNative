import { mapStateToProps, makeOnPressMessages, mergeProps } from './MemberProfile.connector'

describe('mapStateToProps', () => {
  it('maps the state to the props', () => {
    const id = 123
    const navigation = {
      state: {params: {id}},
      navigate: jest.fn()
    }
    const props = mapStateToProps({navigation}, {})
    expect(props).toMatchSnapshot()
    props.goToDetails()
    expect(navigation.navigate).toHaveBeenCalledWith('MemberDetails', {id})
    navigation.navigation.mockClear()
    props.goToEdit()
    expect(navigation.navigate).toHaveBeenCalledWith('MemberDetails', {id, edit: true})
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
    expect(navigation.navigate).toHaveBeenCalledWith('ThreadList')
  })

  it('navigates to existing thread when there is one', () => {
    const messageThreadId = 99
    const onPressMessages = makeOnPressMessages({id: 1}, {id: 2, messageThreadId}, navigation)
    onPressMessages()
    expect(navigation.navigate).toHaveBeenCalledWith('Thread', {id: messageThreadId})
  })

  it('navigates to new message page when there is no existing thread', () => {
    const otherPersonId = 2
    const onPressMessages = makeOnPressMessages({id: 1}, {id: otherPersonId}, navigation)
    onPressMessages()
    expect(navigation.navigate).toHaveBeenCalledWith('NewMessage', {participants: [otherPersonId]})
  })
})

describe('mergeProps', () => {
  it('returns the right keys', () => {
    const id = 78
    const stateProps = {
      currentUser: {id: 1},
      person: {id},
      id
    }
    const dispatchProps = {
      fetchPerson: jest.fn()
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
  })
})
