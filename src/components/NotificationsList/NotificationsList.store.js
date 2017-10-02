import { humanDate } from 'hylo-utils/text'
import { createSelector } from 'redux-orm'
import { find, pick } from 'lodash/fp'

import orm from '../../store/models'
import {
  ACTION_NEW_COMMENT,
  ACTION_TAG,
  ACTION_JOIN_REQUEST,
  ACTION_APPROVED_JOIN_REQUEST,
  ACTION_MENTION,
  ACTION_COMMENT_MENTION
} from '../../store/models/Notification'

export const FETCH_NOTIFICATIONS = 'NotificationsList/FETCH_NOTIFICATIONS'
export const MARK_ACTIVITY_READ = 'NotificationsList/MARK_ACTIVITY_READ'
export const MARK_ALL_ACTIVITIES_READ = 'NotificationsList/MARK_ALL_ACTIVITIES_READ'

export function fetchNotifications () {
  return {
    type: FETCH_NOTIFICATIONS,
    graphql: {
      query: `{
        notifications (first: 20, order: "desc", resetCount: true) {
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
      }`
    },
    meta: {
      extractModel: 'Notification',
      resetCount: true
    }
  }
}

export function markActivityRead (id) {
  return {
    type: MARK_ACTIVITY_READ,
    graphql: {
      query: `mutation ($id: ID) {
        markActivityRead(id: $id) {
          id
        }
      }`,
      variables: {id}
    },
    meta: {
      id,
      optimistic: true
    }
  }
}

export function markAllActivitiesRead () {
  return {
    type: MARK_ALL_ACTIVITIES_READ,
    graphql: {
      query: `mutation {
        markAllActivitiesRead {
          success
        }
      }`
    },
    meta: {
      optimistic: true
    }
  }
}

export function goToNotification (notification) {
  return 
}

function refineActivity ({ action, comment, community, post, reasons }, actor) {
  switch (action) {
    case ACTION_COMMENT_MENTION:
      return {
        body: `wrote: ${comment.text}`,
        header: `mentioned you in a comment on`,
        nameInHeader: true,
        title: post.title
      }

    case ACTION_NEW_COMMENT:
      return {
        body: `wrote: ${comment.text}`,
        header: `New Comment on`,
        title: post.title
      }

    case ACTION_MENTION:
      return {
        body: `wrote: ${post.details}`,
        header: `mentioned you`,
        nameInHeader: true
      }

    case ACTION_TAG:
      const tagReason = find(r => r.startsWith('tag: '), reasons)
      const tag = tagReason.split(': ')[1]
      return {
        body: `wrote: ${post.details}`,
        header: `New Post in`,
      }

    case ACTION_JOIN_REQUEST:
      return {
        body: `asked to join`,
        community: community.name,
        header: `New join request`,
      }

    case ACTION_APPROVED_JOIN_REQUEST:
      return {
        body: `approved your request to join`,
        header: `Join Request Approved`,
      }
  }
}

function refineNotification ({ activity, createdAt, id }, i, notifications) {
  const { action, actor, meta, unread } = activity
  // Only show separator between read and unread notifications
  const avatarSeparator = i !== notifications.length - 1
    ? unread !== notifications[i + 1].activity.unread
    : false

  return {
    id,
    activityId: activity.id,
    actor: pick([ 'avatarUrl', 'name' ], actor),
    avatarSeparator,
    createdAt: humanDate(createdAt),
    ...refineActivity(activity, actor),
    unread
  }
}

export const getNotifications = createSelector(
  orm,
  state => state.orm,
  session => session.Notification.all().toModelArray().map(refineNotification)
)
