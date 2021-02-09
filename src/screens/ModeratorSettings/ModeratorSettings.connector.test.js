import { mapStateToProps, mapDispatchToProps, mergeProps } from './ModeratorSettings.connector'
import orm from 'store/models'

let state
beforeAll(() => {
  const session = orm.session(orm.getEmptyState())
  const group = session.Group.create({ id: '99', slug: 'foo' })
  session.Group.create({ id: '88', slug: 'bar' })

  session.Me.create({
    id: '1',
    memberships: [session.Membership.create({
      id: '345',
      group: group.id,
      hasModeratorRole: true
    })]
  })

  session.Person.create({
    id: '1'
  })

  session.Person.create({
    id: '2'
  })

  session.Membership.create({
    id: '355',
    group: group.id,
    person: '2',
    hasModeratorRole: true
  })

  group.update({ moderators: ['1', '2'] })

  state = {
    orm: session.state,
    ModeratorSettings: []
  }
})

describe('mapStateToProps', () => {
  it('works', () => {
    const props = {
      groupId: '99'
    }

    expect(mapStateToProps(state, props)).toMatchSnapshot()
  })
})

describe('mapDispatchToProps', () => {
  it('creates actions', () => {
    const dispatch = jest.fn()
    const props = {
      route: {
        params: { id: 77 }
      },
      navigation: {
        navigate: jest.fn()
      }
    }
    const dispatchProps = mapDispatchToProps(dispatch, props)
    expect(dispatchProps).toMatchSnapshot()
    dispatchProps.addModeratorMaker(22, 33)
    dispatchProps.removeModeratorMaker(22, true, 33)
    dispatchProps.fetchModeratorsMaker('slug')
    dispatchProps.fetchModeratorSuggestionsMaker(33, 'autocomplete')
    dispatchProps.clearModeratorSuggestions()
    expect(dispatch.mock.calls).toMatchSnapshot()
    dispatchProps.showMember(22)
    expect(props.navigation.navigate.mock.calls).toMatchSnapshot()
  })
})

describe('mergeProps', () => {
  it('merges the props', () => {
    const dispatch = x => x
    const ownProps = {}
    const stateProps = mapStateToProps(state, {})
    const dispatchProps = mapDispatchToProps(dispatch, stateProps)
    const mergedProps = mergeProps(stateProps, dispatchProps, ownProps)
    expect(mergedProps.addModerator(10)).toMatchSnapshot()
    expect(mergedProps.removeModerator(10, true)).toMatchSnapshot()
    expect(mergedProps.fetchModeratorSuggestions('autocomplete')).toMatchSnapshot()
    expect(mergedProps.fetchModerators()).toMatchSnapshot()
    expect(mergedProps).toMatchSnapshot()
  })
})
