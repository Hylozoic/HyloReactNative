import { initialState } from './MemberFeed.store'

describe('initialState', () => {
  it('is how it should be', () => {
    expect(initialState)
      .toEqual({
        choice: 'Posts'
      })
  })
})
