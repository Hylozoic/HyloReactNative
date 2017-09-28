import { createSelector } from 'redux-orm'
import orm from '../../store/models'

export const FETCH_NOTIFICATIONS = 'NotificationsList/FETCH_NOTIFICATIONS'

export const getNotifications = createSelector(
  orm,
  state => state.orm,
  session => {
    return session.Notification.all().toRefArray()
  }
)

export function fetchNotifications (first = 20) {
  return {
    type: FETCH_NOTIFICATIONS,
    graphql: {
      query: `query ($first: Int) {
        notifications (first: $first, order: "desc", resetCount: true) {
          total
          hasMore
          items {
            id
            createdAt
            activity {
              id
              actor {
                id
                name
                avatarUrl
              }
              comment {
                id
                text
              }
              post {
                id
                title
              }
              community {
                id
                name
                slug
              }
              meta {
                reasons
              }
              action
              unread
            }
          }
        }
      }`,
      variables: {
        first
      }
    },
    meta: {
      extractModel: 'Notification',
      resetCount: true
    }
  }
}
