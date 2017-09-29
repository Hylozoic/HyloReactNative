import { connect } from 'react-redux'
import { flagContent } from './FlagContent.store'
import { get } from 'lodash/fp'

export function mapDispatchToProps (dispatch) {
  return {
    submitFlagContent: (category, reason, link) => dispatch(flagContent(category, reason, link))
  }
}

export default connect(null, mapDispatchToProps)
