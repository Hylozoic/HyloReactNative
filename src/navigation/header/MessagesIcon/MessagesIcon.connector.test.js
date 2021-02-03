import { mapStateToProps } from './MessagesIcon.connector'
import orm from 'store/models'

describe('mapStateToProps', () => {
  it('returns showBadge', () => {
    const session = orm.session(orm.getEmptyState())
    session.Me.create({
      name: 'me',
      unseenThreadCount: 12
    })
    const state = { orm: session.state }
    const stateProps = mapStateToProps(state, {})

    expect(stateProps.showBadge).toEqual(true)
  })
})
