import { connect } from 'react-redux'
import getCurrentGroup from 'store/selectors/getCurrentGroup'

export function mapStateToProps (state, props) {
  const group = getCurrentGroup(state, props)

  return {
    groupName: group && group.name
  }
}

export default connect(mapStateToProps)
