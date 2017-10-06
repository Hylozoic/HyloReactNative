import getCommunity from './getCommunity'
import orm from '../models'

describe('getCommunity', () => {
  let state
  beforeEach(() => {
    const session = orm.mutableSession(orm.getEmptyState())
    session.Community.create({ id: '55', slug: 'myslug' })
    state = {orm: session.state}
  })

  it('gets by id correctly', () => {
    const community = getCommunity(state, {id: 55, slug: null})
    expect(community).toBeTruthy()
    expect(community.id).toBe('55')
  })

  it('gets by slug correctly', () => {
    const community = getCommunity(state, {slug: 'myslug', id: null})
    expect(community).toBeTruthy()
    expect(community.id).toBe('55')
    expect(community.slug).toBe('myslug')
  })

  it('gets correctly if both id and slug defined', () => {
    const community = getCommunity(state, {id: 55, slug: 'myslug'})
    expect(community).toBeTruthy()
    expect(community.id).toBe('55')
    expect(community.slug).toBe('myslug')
  })
})
