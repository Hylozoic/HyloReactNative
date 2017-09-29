import { connect } from 'react-redux'
import { flagContent } from './FlagContent.store'
import { get } from 'lodash/fp'

function mapStateToProps (state, props) {
  return { }
}

function mapDispatchToProps (dispatch, props) {
  return {
    submitFlagContent: (category, reason, link) => dispatch(flagContent(category, reason, link))
  }
}

export default connect(mapStateToProps, mapDispatchToProps)
