import orm from 'store/models'
import { getThreads, updateLastViewed } from './ThreadList.store'
import { omit } from 'lodash/fp'

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
    pending: {}
  }

  expect(getThreads(state, null)).toMatchSnapshot()
})

describe('action creators', () => {
  it('matches the last snapshot from updateLastViewed', () => {
    expect(omit('graphql.variables.changes.settings.lastViewedMessagesAt', updateLastViewed())).toMatchSnapshot()
  })
})
