import { connect } from 'react-redux'
import voteOnPost from 'store/actions/voteOnPost'

export function mapDispatchToProps (dispatch, { id, myVote }) {
  return {
    vote: () => dispatch(voteOnPost(id, !myVote))
  }
}

export default connect(null, mapDispatchToProps)
