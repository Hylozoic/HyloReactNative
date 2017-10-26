import { deleteComment } from './Comment.store'

it('deleteComment', () => {
  expect(deleteComment(10)).toMatchSnapshot()
})
