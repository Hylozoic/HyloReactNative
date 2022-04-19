import getCurrentGroupId from './getCurrentGroupId'
import orm from '../models'

describe('getCurrentGroupId', () => {
  let session
  beforeEach(() => {
    session = orm.session(orm.getEmptyState())
  })

  it('gets id from state', () => {
    const state = {
      orm: session.state,
      session: {
        groupId: 55
      }
    }
    const groupId = getCurrentGroupId(state)
    expect(groupId).toBe(55)
  })
})
