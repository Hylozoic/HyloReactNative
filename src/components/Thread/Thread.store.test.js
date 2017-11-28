import orm from 'store/models'

import * as store from './Thread.store'

describe('createMessage', () => {
  it('should match the last snapshot', () => {
    expect(store.createMessage('1', 'So much message.')).toMatchSnapshot()
  })
})

describe('fetchMessages', () => {
  it('should match the last snapshot', () => {
    expect(store.fetchMessages('1', { cursor: 10 })).toMatchSnapshot()
  })
})

describe('getThread', () => {
  let session

  beforeEach(() => {
    session = orm.mutableSession(orm.getEmptyState())
    session.MessageThread.create({ id: '1' })
  })

  it('should match the last snapshot', () => {
    const props = { navigation: { state: { params: { id: '1' } } } }
    const state = { orm: session.state }
    expect(store.getThread(state, props)).toMatchSnapshot()
  })

  it('should return null if the messageThread is not found', () => {
    const props = { navigation: { state: { params: { id: '9999' } } } }
    const state = { orm: session.state }
    const actual = store.getThread(state, props)
    expect(actual).toBe(null)
  })
})

describe('presentThread', () => {
  let session

  beforeEach(() => {
    session = orm.mutableSession(orm.getEmptyState())
    session.Message.create({ id: '4', messageThread: '1', creator: '8' })
    session.Message.create({ id: '10', messageThread: '1', creator: '8' })
    session.Message.create({ id: '1', messageThread: '1', creator: '9' })
    session.Message.create({ id: '200', messageThread: '1', creator: '8' })
    session.Person.create({ id: '8', name: 'Bob', avatarUrl: 'https://wombat.com/test.jpg' })
    session.Person.create({ id: '9', name: 'Sue', avatarUrl: 'https://aardvark.com/test.jpg' })
    session.MessageThread.create({ id: '1', participants: ['8', '9'] })
  })

  it('orders by id (descending) for the inverted list', () => {
    const props = { navigation: { state: { params: { id: '1' } } } }
    const state = { orm: session.state }
    const thread = store.getThread(state, props)
    const presented = store.presentThread(thread, '10')
    expect(presented.messages.map(m => m.id)).toEqual(['200', '10', '4', '1'])
  })

  it('removes currentUser from title', () => {
    const props = { navigation: { state: { params: { id: '1' } } } }
    const state = { orm: session.state }
    const thread = store.getThread(state, props)
    const presented = store.presentThread(thread, '8')
    expect(presented.title).toEqual('Sue')
  })

  it('adds "You" as title if there are no other participants', () => {
    session.MessageThread.create({ id: '2', participants: ['8'] })

    const props = { navigation: { state: { params: { id: '2' } } } }
    const state = { orm: session.state }
    const thread = store.getThread(state, props)
    const presented = store.presentThread(thread, '8')
    expect(presented.title).toEqual('You')
  })
})

describe('updateThreadReadTime', () => {
  it('should match the last snapshot', () => {
    expect(store.updateThreadReadTime('1')).toMatchSnapshot()
  })
})

describe('isWithinBatchLimit', () => {
  const batchSeconds = store.BATCH_MINUTES * 60000

  it('should return false for elapsed time greater than BATCH_MINUTES', () => {
    const prev = new Date() - batchSeconds - 1
    const curr = new Date()
    expect(store.isWithinBatchLimit(curr, prev)).toBe(false)
  })

  it('should return true for elapsed time less than BATCH_MINUTES', () => {
    const prev = new Date() - 1
    const curr = new Date()
    expect(store.isWithinBatchLimit(curr, prev)).toBe(true)
  })
})

describe('refineMessage', () => {
  const referenceDate = new Date()
  const batchSeconds = store.BATCH_MINUTES * 60000
  const elapsedShort = new Date(batchSeconds / 2)
  const elapsedLong = new Date(batchSeconds * 2)

  const short1 = new Date(referenceDate - elapsedShort)
  const short2 = new Date(short1 - elapsedShort)
  const short3 = new Date(short2 - elapsedShort)

  // Message list is ordered by date (desc)
  const messages = [
    {
      id: '6',
      creator: { id: '111' },
      createdAt: referenceDate.toUTCString(),
      text: 'Wombat'
    },
    {
      id: '5',
      creator: { id: '222' },
      createdAt: short1.toUTCString(),
      text: 'Wombat'
    },
    {
      id: '4',
      creator: { id: '222' },
      createdAt: short2.toUTCString(),
      text: 'Wombat'
    },
    {
      id: '3',
      creator: { id: '222' },
      createdAt: short3.toUTCString(),
      text: 'Bar'
    },
    {
      id: '2',
      creator: { id: '222' },
      createdAt: new Date(short3 - elapsedLong).toUTCString(),
      text: 'Bar'
    }
  ]

  it('sets suppressCreator true for subsequent messages from the same creator inside BATCH_MINUTES', () => {
    const actual = store.refineMessage(messages[2], 2, messages)
    expect(actual.suppressCreator).toBe(true)
  })

  it('sets suppressDate false for the last message from the same creator inside BATCH_MINUTES', () => {
    const actual = store.refineMessage(messages[1], 1, messages)
    // Can be null
    expect(actual.suppressDate).toBeFalsy()
  })

  it('sets suppressDate true for messages prior to the last from the same creator inside BATCH_MINUTES', () => {
    const first = store.refineMessage(messages[2], 2, messages)
    const second = store.refineMessage(messages[3], 3, messages)
    expect(first.suppressDate).toBe(true)
    expect(second.suppressDate).toBe(true)
  })

  it('sets suppressCreator to false for subsequent messages from the same creator outside BATCH_MINUTES', () => {
    const actual = store.refineMessage(messages[3], 3, messages)
    expect(actual.suppressCreator).toBeFalsy()
  })

  it('sets suppressDate to false for messages from the same creator outside BATCH_MINUTES', () => {
    const actual = store.refineMessage(messages[4], 4, messages)
    expect(actual.suppressDate).toBeFalsy()
  })
})
