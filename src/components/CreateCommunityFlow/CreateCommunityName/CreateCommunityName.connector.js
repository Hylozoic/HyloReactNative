import { connect } from 'react-redux'
import { saveCommunityName } from './CreateCommunityName.store'

export const mapDispatchToProps = {
  saveCommunityName
}

export default connect(null, mapDispatchToProps)
