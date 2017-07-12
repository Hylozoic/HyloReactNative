import { connect } from 'react-redux'

function mapStateToProps (state, props) {
  return {
    communityId: state.currentCommunity
  }
}

export default connect(mapStateToProps)
