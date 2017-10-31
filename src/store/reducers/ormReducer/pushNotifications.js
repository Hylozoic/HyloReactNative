import { RECEIVE_PUSH_NOTIFICATION } from '../../actions/receivePushNotification'

export default function (session, action) {
  const { type, payload: notification } = action
  if (type !== RECEIVE_PUSH_NOTIFICATION) return

  console.log(notification)

  const { path } = notification.payload.additionalData
  if (path.startsWith('/t/')) {
    // toggle messages icon badge

    // call reconnectFetchMessages in thread if it's open? or will socket reconnection
    // take care of that?

    // refresh thread list
  } else if (false) {
    // toggle notifications icon badge
  }
}
