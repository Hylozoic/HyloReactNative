import { connect } from 'react-redux'
import getCurrentCommunity from '../../../../store/selectors/getCurrentCommunity'

export function mapStateToProps (state) {
  return {
    currentCommunity: getCurrentCommunity(state)
  }
}

export default connect(mapStateToProps)
