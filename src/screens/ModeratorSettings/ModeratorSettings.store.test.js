import reducer, {
  ormSessionReducer,
  fetchModeratorSuggestions,
  clearModeratorSuggestions,
  addModerator,
  fetchModerators,
  removeModerator,
  CLEAR_MODERATOR_SUGGESTIONS,
  FETCH_MODERATOR_SUGGESTIONS,
  REMOVE_MODERATOR_PENDING,
  ADD_MODERATOR_PENDING
} from './ModeratorSettings.store'
import orm from 'store/models'

it('fetchModerators', () => {
  expect(fetchModerators('mygroup')).toMatchSnapshot()
})

it('fetchModeratorSuggestions', () => {
  expect(fetchModeratorSuggestions(123, 'to')).toMatchSnapshot()
})

it('clearModeratorSuggestions', () => {
  expect(clearModeratorSuggestions()).toMatchSnapshot()
})

it('addModerator', () => {
  expect(addModerator(123, 111)).toMatchSnapshot()
})

it('removeModerator', () => {
  expect(removeModerator(123, 111, true)).toMatchSnapshot()
})

describe('reducer', () => {
  it('should handle CLEAR_MODERATOR_SUGGESTIONS', () => {
    const expected = []
    const actual = reducer({}, {
      type: CLEAR_MODERATOR_SUGGESTIONS
    })
    expect(actual).toEqual(expected)
  })

  it('should handle FETCH_MODERATOR_SUGGESTIONS', () => {
    const expected = [11, 12]
    const actual = reducer({}, {
      type: FETCH_MODERATOR_SUGGESTIONS,
      payload: {
        data: {
          group: {
            members: {
              items: [
                { id: 11 },
                { id: 12 }
              ]
            }
          }
        }
      }
    })
    expect(actual).toEqual(expected)
  })
})

describe('ModeratorSettings.store.ormSessionReducer', () => {
  let session
  beforeEach(() => {
    session = orm.session(orm.getEmptyState())
  })

  it('responds to ADD_MODERATOR_PENDING', () => {
    session.Group.create({ id: '5' })
    session.Person.create({ id: '10', name: 'John Smith' })

    const action = {
      type: ADD_MODERATOR_PENDING,
      payload: {
        data: {
          addModerator: {
            id: 10
          }
        }
      },
      meta: { personId: 10, groupId: '5' }
    }

    ormSessionReducer(session, action)
    const moderators = session.Group.withId(5).moderators.toRefArray()
    expect(moderators).toHaveLength(1)
    expect(moderators[0].name).toEqual('John Smith')
  })

  it('responds to REMOVE_MODERATOR_PENDING', () => {
    const group = session.Group.create({ id: '5' })
    const person = session.Person.create({ id: '10', name: 'John Smith' })
    group.updateAppending({ moderators: [person] })

    const action = {
      type: REMOVE_MODERATOR_PENDING,
      meta: { groupId: '5', personId: '10' }
    }

    expect(session.Group.withId('5').moderators.toRefArray()).toHaveLength(1)
    ormSessionReducer(session, action)
    expect(session.Group.withId('5').moderators.toRefArray()).toHaveLength(0)
  })
})
