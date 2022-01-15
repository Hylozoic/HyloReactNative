import { connect } from 'react-redux'
import { getThread } from '../Thread/Thread.store'
import getCurrentUserId from 'store/selectors/getCurrentUserId'
import { modalScreenName } from 'navigation/linking/helpers'

export function mapStateToProps (state, props) {
  const currentUserId = getCurrentUserId(state)
  const thread = getThread(state, props)
  const participants = thread && thread.participants.filter(p => p.id !== currentUserId).toRefArray()
  return {
    participants,
    goToParticipant: id => props.navigation.navigate(modalScreenName('Member'), { id })
  }
}

export default connect(mapStateToProps)
