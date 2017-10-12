import { voteOnPost } from './PostFooter.store'

it('should match the last snapshot', () => {
  expect(voteOnPost(10, true)).toMatchSnapshot()
})
