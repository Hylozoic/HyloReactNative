import { connect } from 'react-redux'
import { fetchCommunityExists } from '../actions'

export const mapDispatchToProps = {
  fetchCommunityExists
}

export default connect(null, mapDispatchToProps)
