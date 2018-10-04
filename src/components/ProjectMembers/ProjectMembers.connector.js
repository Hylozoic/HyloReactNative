import { connect } from 'react-redux'
import fetchPost from '../../store/actions/fetchPost'

function getProjectId (_, props) {
  return props.navigation.state.params.id
}

export function mapStateToProps (state, props) {
  const id = getProjectId(state, props)
  return {
    id
  }
}

export function mapDispatchToProps (dispatch, props) {
  const id = getProjectId(null, props)

  return {
    fetchPost: () => dispatch(fetchPost(id))
  }
}

export default connect(mapStateToProps, mapDispatchToProps)
