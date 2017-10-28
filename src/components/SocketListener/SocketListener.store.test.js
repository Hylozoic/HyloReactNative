import { ormSessionReducer, RECEIVE_MESSAGE } from './SocketListener.store'
import orm from 'store/models'

describe('ormSessionReducer', () => {
  let session
  beforeEach(() => {
    session = orm.session(orm.getEmptyState())
  })

  it('handles RECEIVE_MESSAGE', () => {
    session.MessageThread.create({id: '1'})
    session.Me.create({id: '1'})

    const date = new Date()
    const action = {
      type: RECEIVE_MESSAGE,
      payload: {
        data: {
          message: {
            messageThread: '1',
            createdAt: date
          }
        }
      }
    }

    ormSessionReducer(session, action)
    expect(session.MessageThread.withId('1').updatedAt).toEqual(date)
    expect(session.Me.first().unseenThreadCount).toEqual(1)
  })
})
