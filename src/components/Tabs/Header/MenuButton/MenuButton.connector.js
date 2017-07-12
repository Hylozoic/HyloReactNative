import { connect } from 'react-redux'
import component from './MenuButton'

export function mapStateToProps (state) {
  const placeholderCurrentCommunity = {
    avatarUrl: 'https://s3.amazonaws.com/uifaces/faces/twitter/josevnclch/128.jpg'
  }
  return {
    currentCommunity: placeholderCurrentCommunity
  }
}

export default connect(mapStateToProps)
