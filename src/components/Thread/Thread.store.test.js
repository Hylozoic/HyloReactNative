import orm from 'store/models'

import { createMessage, fetchMessages, getThread, updateThreadReadTime } from './Thread.store'

describe('createMessage', () => {
  it('should match the last snapshot', () => {
    expect(createMessage('1', 'So much message.')).toMatchSnapshot()
  })
})

describe('fetchMessages', () => {
  it('should match the last snapshot', () => {
    expect(fetchMessages('1', { cursor: 10 })).toMatchSnapshot()
  })
})

describe('getThread', () => {
  let session

  beforeEach(() => {
    session = orm.mutableSession(orm.getEmptyState())
    session.Me.create({ id: '55' })
    session.MessageThread.create({ id: '1' })
    session.Message.create({ id: '4', messageThread: '1', creator: '8' })
    session.Message.create({ id: '10', messageThread: '1', creator: '8' })
    session.Message.create({ id: '1', messageThread: '1', creator: '9' })
    session.Message.create({ id: '200', messageThread: '1', creator: '8' })
    session.Person.create({ id: '8', avatarUrl: 'https://wombat.com/test.jpg' })
    session.Person.create({ id: '9', avatarUrl: 'https://aardvark.com/test.jpg' })
  })

  it('should match the last snapshot', () => {
    const props = { navigation: { state: { params: { id: '1' } } } }
    const state = { orm: session.state }
    expect(getThread(state, props)).toMatchSnapshot()
  })

  it('should order by id (descending) for the inverted list', () => {
    const props = { navigation: { state: { params: { id: '1' } } } }
    const state = { orm: session.state }
    const actual = getThread(state, props).messages
    expect(actual.map(m => m.id)).toEqual(['200', '10', '4', '1'])
  })

  it('should return null if the messageThread is not found', () => {
    const props = { navigation: { state: { params: { id: '9999' } } } }
    const state = { orm: session.state }
    const actual = getThread(state, props)
    expect(actual).toBe(null)
  })
})

describe('updateThreadReadTime', () => {
  it('should match the last snapshot', () => {
    expect(updateThreadReadTime('1')).toMatchSnapshot()
  })
})
