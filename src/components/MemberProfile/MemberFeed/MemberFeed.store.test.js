import { defaultState } from './MemberFeed.store'

describe('defaultState', () => {
  it('is how it should be', () => {
    expect(defaultState)
    .toEqual({
      choice: 'Posts'
    })
  })
})
