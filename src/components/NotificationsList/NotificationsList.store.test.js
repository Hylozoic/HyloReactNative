import orm from 'store/models'
import { getThreads } from './ThreadList.store'
import { FETCH_THREADS } from '../../store/actions/fetchThreads'
import { buildKey } from '../../store/reducers/queryResults'

const session = orm.session(orm.getEmptyState())

const specs = [
  {
    modelName: 'Person',
    values: {
      id: 1,
      name: 'First Person'
    }
  },
  {
    modelName: 'Person',
    values: {
      id: 2,
      name: 'Second Person'
    }
  },
  {
    modelName: 'Person',
    values: {
      id: 3,
      name: 'Third Person'
    }
  },
  {
    modelName: 'MessageThread',
    values: {
      id: 1,
      unreadCount: 1,
      participants: [1, 2]
    }
  },
  {
    modelName: 'MessageThread',
    values: {
      id: 2,
      unreadCount: 1,
      participants: [2, 3]
    }
  },
  {
    modelName: 'Message',
    values: {
      id: 1,
      text: 'First message',
      messageThread: 1
    }
  },
  {
    modelName: 'Message',
    values: {
      id: 2,
      text: 'Second message',
      messageThread: 1
    }
  },
  {
    modelName: 'Message',
    values: {
      id: 3,
      text: 'Third message',
      messageThread: 2
    }
  }
]

specs.forEach(spec => session[spec.modelName].create(spec.values))

it('gets threads and denormalizes messages and participants', () => {
  const state = {
    orm: session.state,
    pending: {},
    queryResults: {
      [buildKey(FETCH_THREADS, {slug: 'foo'})]: {
        ids: ['1', '3', '2'],
        hasMore: true
      }
    }
  }

  expect(getThreads(state, null)).toMatchSnapshot()
})
