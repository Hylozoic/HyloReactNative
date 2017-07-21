import { connect } from 'react-redux'
import { fakePerson } from '../PostCard/samplePost'

export function mapStateToProps (state, props) {
  return {
    recentContacts: fakePerson(3),
    allContacts: fakePerson(7)
  }
}

export default connect(mapStateToProps)
