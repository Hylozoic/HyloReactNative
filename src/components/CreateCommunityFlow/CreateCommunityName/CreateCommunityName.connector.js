import { connect } from 'react-redux'
import { saveCommunityName } from '../CreateCommunityFlow.store'

export const mapDispatchToProps = {
  saveCommunityName
}

export default connect(null, mapDispatchToProps)
