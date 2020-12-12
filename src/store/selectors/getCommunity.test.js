import getCommunity from './getCommunity'
import orm from '../models'

describe('getCommunity', () => {
  let state

  beforeEach(() => {
    const session = orm.mutableSession(orm.getEmptyState())
    session.Community.create({ id: '1111', slug: 'slugger1' })
    session.Community.create({ id: '55', slug: 'myslug' })
    session.Community.create({ id: '3333', slug: 'slugger3' })
    state = { orm: session.state }
  })

  it('gets by id correctly', () => {
    const community = getCommunity(state, { id: 55, slug: null })
    expect(community).toBeTruthy()
    expect(community.id).toBe('55')
  })

  it('gets by slug correctly', () => {
    const community = getCommunity(state, { slug: 'myslug', id: null })
    expect(community).toBeTruthy()
    expect(community.id).toBe('55')
    expect(community.slug).toBe('myslug')
  })

  it('gets correctly if both id and slug defined', () => {
    const community = getCommunity(state, { id: 55, slug: 'myslug' })
    expect(community).toBeTruthy()
    expect(community.id).toBe('55')
    expect(community.slug).toBe('myslug')
  })

  it('proves that ref is better than sessionBoundModel for performance in selectors', () => {
    const communityBySlug = getCommunity(state, { slug: 'myslug' })
    getCommunity(state, { id: 1111 }) // Forces a recompute since the selector has a cache size of 1
    const communityById = getCommunity(state, { id: 55 })

    // Here we prove that even though it's the SAME community, it's using a sessionBoundModel object which doesn't have === equality,
    // hence, any purecomponent we pass it to will re-render every time it's recomputed.
    expect(communityBySlug === communityById).toBeFalsy()

    // If we get the `ref` than it is truthy, and even though the selector recomputed, it was still the same.
    expect(communityById.ref === communityBySlug.ref).toBeTruthy()
  })
})
