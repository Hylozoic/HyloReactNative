import { attr, fk, Model } from 'redux-orm'

class Notification extends Model {
  toString () {
    return `Message: ${this.id}`
  }
}

export default Notification

Notification.modelName = 'Notification'

Notification.fields = {
  id: attr(),
  activity: fk('Activity'),
  createdAt: attr()
}

export const ACTION_NEW_COMMENT = 'newComment'
export const ACTION_TOPIC = 'tag'
export const ACTION_JOIN_REQUEST = 'joinRequest'
export const ACTION_APPROVED_JOIN_REQUEST = 'approvedJoinRequest'
export const ACTION_MENTION = 'mention'
export const ACTION_COMMENT_MENTION = 'commentMention'
export const ACTION_ANNOUNCEMENT = 'announcement'
export const ACTION_NEW_POST = 'newPost'

export const NOTIFICATIONS_WHITELIST = [
  ACTION_NEW_COMMENT,
  ACTION_TOPIC,
  ACTION_JOIN_REQUEST,
  ACTION_APPROVED_JOIN_REQUEST,
  ACTION_MENTION,
  ACTION_COMMENT_MENTION,
  ACTION_ANNOUNCEMENT,
  ACTION_NEW_POST
]
