import { mapStateToProps, mapDispatchToProps } from './ModeratorSettings.connector'
import orm from '../../store/models'

let state
beforeAll(() => {
  const session = orm.session(orm.getEmptyState())
  const community = session.Community.create({id: '99', slug: 'foo'})
  session.Community.create({id: '88', slug: 'bar'})

  session.Me.create({
    id: '1',
    memberships: [session.Membership.create({
      id: '345',
      community: community.id,
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
    community: community.id,
    person: '2',
    hasModeratorRole: true
  })

  community.update({moderators: ['1', '2']})

  state = {
    orm: session.state,
    ModeratorSettings: []
  }
})

describe('mapStateToProps', () => {
  it('works', () => {
    const props = {
      communityId: '99'
    }

    expect(mapStateToProps(state, props)).toMatchSnapshot()
  })
})

describe('mapDispatchToProps', () => {
  it('creates actions', () => {
    const dispatch = jest.fn()
    const props = {
      navigation: {
        state: {params: {id: 77}},
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
