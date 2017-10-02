import { mapStateToProps } from './Home.connector'
import orm from '../../../store/models'

describe('mapStateToProps', () => {
  it('handles null value for lastViewedCommunity', () => {
    const session = orm.session(orm.getEmptyState())
    session.Me.create({id: 123})
    const state = {
      orm: session.state
    }
    expect(mapStateToProps(state)).toMatchSnapshot()
  })
})
