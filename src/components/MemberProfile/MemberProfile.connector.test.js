import { makeOnPressMessages, mergeProps } from './MemberProfile.connector'

describe('makeOnPressMessages', () => {
  it('navigates to the right place', () => {
    const navigation = {
      navigate: jest.fn()
    }
    const otherPersonId = 2
    const pmSamePerson = makeOnPressMessages({id: 1}, {id: 1}, navigation)
    pmSamePerson()
    expect(navigation.navigate).toHaveBeenCalledWith('ThreadList')
    navigation.navigate.mockClear()

    const messageThreadId = 99
    const pmHasMessageThread = makeOnPressMessages({id: 1}, {id: otherPersonId, messageThreadId}, navigation)
    pmHasMessageThread()
    expect(navigation.navigate).toHaveBeenCalledWith('Thread', {id: messageThreadId})
    navigation.navigate.mockClear()

    const pmNoMessageThread = makeOnPressMessages({id: 1}, {id: otherPersonId}, navigation)
    pmNoMessageThread()
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
