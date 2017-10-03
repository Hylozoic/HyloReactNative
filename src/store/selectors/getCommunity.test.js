import getCommunity from './getCommunity'
import orm from '../models'

describe('getCommunity', () => {
  let session
  beforeAll(() => {
    session = orm.mutableSession(orm.getEmptyState())
    session.Community.create({ id: '55', slug: 'myslug' })
  })

  it('gets by id correctly', () => {
    const community = getCommunity({ orm: session.state }, {id: 55})
    expect(community).toBeTruthy()
    expect(community.id).toBe('55')
  })

  it('gets by slug correctly', () => {
    const community = getCommunity({ orm: session.state }, {slug: 'myslug'})
    expect(community).toBeTruthy()
    expect(community.id).toBe('55')
    expect(community.slug).toBe('myslug')
  })

  it('gets correctly if both id and slug defined', () => {
    const community = getCommunity({ orm: session.state }, {id: 55, slug: 'myslug'})
    expect(community).toBeTruthy()
    expect(community.id).toBe('55')
    expect(community.slug).toBe('myslug')
  })
})
