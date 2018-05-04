import {
  findPeople,
  findTopics
} from './Search.store'

it('matches snapshot for findPeople', () => {
  const term = 'myTerm'
  expect(findPeople(term)).toMatchSnapshot()
})

it('matches snapshot for findTopics', () => {
  const term = 'myTerm'
  const communityId = 1
  expect(findTopics(term, communityId)).toMatchSnapshot()
})
