import { setPlaceholder } from './Search'

it('correctly sets a placeholder', () => {
  const type = 'someType'
  expect(setPlaceholder(type)).toMatchSnapshot()
})
