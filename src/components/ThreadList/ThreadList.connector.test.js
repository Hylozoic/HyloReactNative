import { mapDispatchToProps } from './ThreadList.connector'

it('creates a showThread function that takes an id or an object', () => {
  const navigation = {navigate: jest.fn()}
  const { showThread } = mapDispatchToProps(null, {navigation})
  showThread(1)
  expect(navigation.navigate).toBeCalledWith('Thread', {id: 1})
  showThread({id: 2})
  expect(navigation.navigate).toBeCalledWith('Thread', {id: 2})
})
