import { connect } from 'react-redux'
import { getMessage, setMessage } from 'navigation/NewMessage/NewMessage.store.js'

export function mapStateToProps (state, props) {
  const message = getMessage(state)
  return {
    message
  }
}

export const mapDispatchToProps = {
  setMessage
}

export default connect(mapStateToProps, mapDispatchToProps)
