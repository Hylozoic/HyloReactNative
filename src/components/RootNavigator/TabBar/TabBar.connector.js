import { connect } from 'react-redux'

function mapStateToProps (state) {
  return {
    isVisible: state.TabBar.isVisible
  }
}

export default connect(mapStateToProps)
