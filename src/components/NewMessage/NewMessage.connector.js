import { connect } from 'react-redux'
import { fakePerson } from '../PostCard/samplePost'
import getMe from '../../store/selectors/getMe'

export function mapStateToProps (state, props) {
  return {
    recentContacts: fakePerson(3),
    allContacts: fakePerson(7),
    selectedContacts: fakePerson(0),
    currentUser: getMe(state, props)
  }
}

export default connect(mapStateToProps)
