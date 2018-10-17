import { mapStateToProps, mapDispatchToProps, mergeProps, makeFetchOpts } from './Members.connector'
import { MODULE_NAME } from './Members.store'
import orm from '../../../store/models'

describe('makeFetchOpts', () => {
  it('handles a network', () => {
    const props = {
      network: {
        slug: 'netslug'
      },
      community: null,
      sortBy: 'join',
      search: 'fee'
    }
    expect(makeFetchOpts(props)).toMatchSnapshot()
  })

  it('handles a community', () => {
    const props = {
      network: null,
      community: {
        slug: 'comslug'
      },
      sortBy: 'join',
      search: 'fee'
    }
    expect(makeFetchOpts(props)).toMatchSnapshot()
  })

  it('handles no community or network', () => {
    const props = {
      network: null,
      community: null,
      sortBy: 'join',
      search: 'fee'
    }
    expect(makeFetchOpts(props)).toMatchSnapshot()
  })
})

describe('mapStateToProps', () => {
  it('handles null value for lastViewedCommunity', () => {
    const session = orm.session(orm.getEmptyState())
    const community = session.Community.create({id: 10, slug: 'tom'})
    session.Me.create({
      id: 123,
      memberships: [session.Membership.create({
        id: '345',
        community: community.id,
        hasModeratorRole: true
      })]
    })

    const state = {
      orm: session.state,
      [MODULE_NAME]: {},
      pending: {},
      queryResults: {}
    }
    session.Community.create({})
    expect(mapStateToProps(state)).toMatchSnapshot()
  })
})

describe('mapDispatchToProps', () => {
  it('returns the right keys', () => {
    expect(mapDispatchToProps(() => {})).toMatchSnapshot()
  })
})

describe('mergeProps', () => {
  let dispatchProps, stateProps

  beforeEach(() => {
    dispatchProps = { fetchMembers: jest.fn() }
    stateProps = { hasMore: true, members: [], pending: false }
  })

  it('makes fetchMembers a no-op when there is no community or network', () => {
    const props = mergeProps(stateProps, dispatchProps)
    expect(props.fetchMembers()).toEqual(undefined)
    expect(dispatchProps.fetchMembers).not.toBeCalled()
  })

  it("makes fetchMoreMembers an empty function if there ain't no more", () => {
    stateProps.hasMore = false
    const actual = mergeProps(stateProps, dispatchProps)
    actual.fetchMoreMembers()
    expect(dispatchProps.fetchMembers).not.toHaveBeenCalled()
  })

  it('calls fetchMembers with the correct offset when fetchMoreMembers is called', () => {
    stateProps.members = [ 'so', 'many', 'members' ]
    const actual = mergeProps(stateProps, dispatchProps)
    actual.fetchMoreMembers()
    expect(dispatchProps.fetchMembers.mock.calls[0][0].offset).toBe(stateProps.members.length)
  })
})
