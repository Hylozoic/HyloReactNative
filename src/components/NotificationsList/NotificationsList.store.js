import { makeGetQueryResults, makeQueryResultsModelSelector } from '../../store/reducers/queryResults'
import { createSelector } from 'reselect'
import { get, includes, isEmpty } from 'lodash/fp'
import orm from '../../store/models'

export const FETCH_NOTIFICATIONS = 'NotificationsList/FETCH_NOTIFICATIONS'

const getNotificationsResults = makeGetQueryResults(FETCH_NOTIFICATIONS)

export const getNotifications = makeQueryResultsModelSelector(
  getNotificationsResults,
  'Notification',
  notification => ({
    ...notification.ref
  })
)

export const getNotificationsHasMore = createSelector(getNotificationsResults, get('hasMore'))


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
