import { mapDispatchToProps, mergeProps } from './ThreadList.connector'
import { UPDATE_LAST_VIEWED } from './ThreadList.store'

describe('mapDispatchToProps', () => {
  it('creates showThread and updateLastViewed functions', () => {
    const navigation = {navigate: jest.fn()}
    const dispatch = jest.fn()
    const { showThread, updateLastViewed } = mapDispatchToProps(dispatch, {navigation})
    showThread(1)
    expect(navigation.navigate).toBeCalledWith('Thread', {id: 1})
    showThread({id: 2})
    expect(navigation.navigate).toBeCalledWith('Thread', {id: 2})
    updateLastViewed()
    expect(dispatch.mock.calls[0][0].type).toEqual(UPDATE_LAST_VIEWED)
  })
})

describe('mergeProps', () => {
  const dispatchProps = {
    fetchThreads: jest.fn(),
    updateLastViewed: jest.fn()

  }
  const { fetchThreads } = mergeProps({}, dispatchProps, {})
  fetchThreads()
  expect(dispatchProps.fetchThreads).toHaveBeenCalledWith(10)
  expect(dispatchProps.updateLastViewed).toHaveBeenCalled()
})
