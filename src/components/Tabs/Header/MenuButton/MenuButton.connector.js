import { connect } from 'react-redux'
import getCommunity from '../../../../store/selectors/getCommunity'

export function mapStateToProps (state) {
  return {
    currentCommunity: getCommunity(state, {id: state.currentCommunity})
  }
}

export default connect(mapStateToProps)
