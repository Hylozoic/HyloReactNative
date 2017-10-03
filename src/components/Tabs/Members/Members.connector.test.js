import { mapStateToProps } from './Members.connector'
import { MODULE_NAME } from './Members.store'
import orm from '../../../store/models'

describe('mapStateToProps', () => {
  it('handles null value for lastViewedCommunity', () => {
    const session = orm.session(orm.getEmptyState())
    session.Me.create({id: 123})
    const state = {
      orm: session.state,
      [MODULE_NAME]: {},
      pending: {},
      queryResults: {}
    }
    expect(mapStateToProps(state)).toMatchSnapshot()
  })
})
