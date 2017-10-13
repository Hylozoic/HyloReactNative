import { connect } from 'react-redux'
import { checkVersion, CHECK_VERSION } from '../VersionCheck/actions'
import { platformName, appVersion } from 'util/platform'

export function mapStateToProps (state) {
  const pending = state.pending[CHECK_VERSION]
  return {
    updateType: state.session.checkVersion,
    pending
  }
}

export function mapDispatchToProps (dispatch) {
  return {
    checkVersion: () => dispatch(checkVersion(platformName, appVersion))
  }
}

export default connect(mapStateToProps, mapDispatchToProps)
