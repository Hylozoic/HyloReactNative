import { connect } from 'react-redux'
import { storeNavigationAction } from './DeepLinkHandler.store'
import getMe from 'store/selectors/getMe'

function mapStateToProps (state, props) {
  return {
    currentUser: getMe(state, props)
  }
}

const mapDispatchToProps = {storeNavigationAction}

export default connect(mapStateToProps, mapDispatchToProps)
