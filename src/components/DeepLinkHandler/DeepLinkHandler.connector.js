import { connect } from 'react-redux'
import { storeDeepLink } from './DeepLinkHandler.store'
import getMe from 'store/selectors/getMe'

function mapStateToProps (state, props) {
  return {
    currentUser: getMe(state, props)
  }
}

const mapDispatchToProps = {storeDeepLink}

export default connect(mapStateToProps, mapDispatchToProps)
