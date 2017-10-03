import { mapStateToProps } from './PostHeader.connector'
import orm from '../../../store/models'

describe('mapStateToProps', () => {
  it('gets community and currentUser', () => {
    const session = orm.session(orm.getEmptyState())
    session.Me.create({id: 20})
    session.Community.create({id: 33, slug: 'mycommunity'})
    const state = {
      orm: session.state
    }

    const ownProps = {creator: {id: 20}, slug: 'mycommunity'}
    const { community, currentUser } = mapStateToProps(state, ownProps)

    expect(community.id).toBe(33)
    expect(currentUser.id).toBe(20)
  })

  it('cannot Flag when user is creator', () => {
    const session = orm.session(orm.getEmptyState())
    session.Me.create({id: 20})
    session.Community.create({id: 33})
    const state = {
      orm: session.state
    }

    const ownProps = {creator: {id: 20}}
    const { canFlag, community, currentUser } = mapStateToProps(state, ownProps)

    expect(canFlag).toBeFalsy()
  })

  it('can Flag when user is not creator', () => {
    const session = orm.session(orm.getEmptyState())
    session.Me.create({id: 20})
    session.Community.create({id: 33})
    const state = {
      orm: session.state
    }

    const ownProps = {creator: {id: 40}}
    const { canFlag } = mapStateToProps(state, ownProps)

    expect(canFlag).toBeTruthy()
  })
  
  it('can edit post when user is creator', () => {
    const session = orm.session(orm.getEmptyState())
    session.Me.create({id: 20})
    session.Community.create({id: 33})
    const state = {
      orm: session.state
    }

    const ownProps = {creator: {id: 20}}
    const { canEdit, editPost } = mapStateToProps(state, ownProps)

    expect(canEdit).toBeTruthy()
    expect(editPost).toBeTruthy()
  })

  it('cannot edit post when user is not creator', () => {
    const session = orm.session(orm.getEmptyState())
    session.Me.create({id: 20})
    session.Community.create({id: 33})
    const state = {
      orm: session.state
    }

    const ownProps = {creator: {id: 40}}
    const { canEdit, editPost } = mapStateToProps(state, ownProps)

    expect(canEdit).toBeFalsy()
    expect(editPost).toBeFalsy()
  })
})
