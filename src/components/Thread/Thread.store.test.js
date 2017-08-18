import orm from 'store/models'

import { getThread } from './Thread.store'

describe('getThread', () => {
  it('should order by id (descending) for the inverted list', () => {
    const session = orm.mutableSession(orm.getEmptyState())
    session.MessageThread.create({ id: '1' })
    session.Message.create({ id: '4', messageThread: '1', creator: '8' })
    session.Message.create({ id: '10', messageThread: '1', creator: '8' })
    session.Message.create({ id: '1', messageThread: '1', creator: '9' })
    session.Message.create({ id: '200', messageThread: '1', creator: '8' })
    session.Person.create({ id: '8', avatarUrl: 'https://wombat.com/test.jpg' })
    session.Person.create({ id: '9', avatarUrl: 'https://aardvark.com/test.jpg' })

    const props = { navigation: { state: { params: { id: '1' } } } }
    const state = { orm: session.state }
    const actual = getThread(state, props).messages
    expect(actual.map(m => m.id)).toEqual(['200', '10', '4', '1'])
  })

  it('should return null if the messageThread is not found', () => {
    const session = orm.mutableSession(orm.getEmptyState())
    const props = { navigation: { state: { params: { id: '1' } } } }
    const state = { orm: session.state }
    const actual = getThread(state, props)
    expect(actual).toBe(null)
  })
})
