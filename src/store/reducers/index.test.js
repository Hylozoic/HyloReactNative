import reducers from './index'

it('sets up the expected reducers', () => {
  const action = {type: 'HELLO_WORLD', payload: 'hello world'}
  expect(reducers({}, action)).toMatchSnapshot()
})
