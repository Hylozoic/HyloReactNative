import { createSelector } from 'reselect'
import { createSelector as ormCreateSelector } from 'redux-orm'
import { get, find, pick } from 'lodash/fp'
import { humanDate } from 'hylo-utils/text'
import { decode } from 'ent'
import striptags from 'striptags'

import orm from 'store/models'
import { makeGetQueryResults } from 'store/reducers/queryResults'
import { getPostFieldsFragment } from 'store/actions/fetchPost'
import {
  ACTION_NEW_COMMENT,
  ACTION_TOPIC,
  ACTION_JOIN_REQUEST,
  ACTION_APPROVED_JOIN_REQUEST,
  ACTION_MENTION,
  ACTION_COMMENT_MENTION,
  ACTION_ANNOUNCEMENT,
  NOTIFICATIONS_WHITELIST
} from 'store/models/Notification'

export const MODULE_NAME = 'NotificationsList'
export const FETCH_NOTIFICATIONS = `${MODULE_NAME}/FETCH_NOTIFICATIONS`
export const MARK_ACTIVITY_READ = `${MODULE_NAME}/MARK_ACTIVITY_READ`
export const MARK_ALL_ACTIVITIES_READ = `${MODULE_NAME}/MARK_ALL_ACTIVITIES_READ`
export const UPDATE_NEW_NOTIFICATION_COUNT = `${MODULE_NAME}/UPDATE_NEW_NOTIFICATION_COUNT`
export const UPDATE_NEW_NOTIFICATION_COUNT_PENDING = `${UPDATE_NEW_NOTIFICATION_COUNT}_PENDING`

export const NOTIFICATION_TEXT_MAX = 100

export function fetchNotifications (first = 20, offset = 0) {
  return {
    type: FETCH_NOTIFICATIONS,
    graphql: {
      query: `query ($first: Int, $offset: Int) {
        notifications (first: $first, offset: $offset, order: "desc") {
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
                ${getPostFieldsFragment(true)}
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
      variables: { first, offset }
    },
    meta: {
      afterInteractions: true,
      extractModel: 'Notification',
      extractQueryResults: {
        getItems: get('payload.data.notifications')
      },
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
      variables: { id }
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

export function updateNewNotificationCount () {
  return {
    type: UPDATE_NEW_NOTIFICATION_COUNT,
    graphql: {
      query: `mutation ($changes: MeInput) {
        updateMe(changes: $changes) {
          id
        }
      }`,
      variables: {
        changes: {
          newNotificationCount: 0
        }
      }
    },
    meta: {
      optimistic: true
    }
  }
}

export function presentedText (text) {
  const stripped = striptags(text)
  return decode(stripped.substring(0, NOTIFICATION_TEXT_MAX))
}

export function refineActivity ({ action, actor, comment, community, post, meta }, { navigate }) {
  switch (action) {
    case ACTION_COMMENT_MENTION:
      return {
        body: `wrote: ${presentedText(comment.text)}`,
        header: 'mentioned you in a comment on',
        nameInHeader: true,
        onPress: () => navigate('Post Details', { id: post.id }),
        title: post.title
      }

    case ACTION_NEW_COMMENT:
      return {
        body: `wrote: ${presentedText(comment.text)}`,
        header: 'New Comment on',
        onPress: () => navigate('Post Details', { id: post.id }),
        title: post.title
      }

    case ACTION_MENTION:
      return {
        body: `wrote: ${presentedText(post.details)}`,
        header: 'mentioned you',
        onPress: () => navigate('Post Details', { id: post.id }),
        nameInHeader: true
      }

    case ACTION_TOPIC:
      const topicReason = find(r => r.startsWith('tag: '), meta.reasons)
      const topic = topicReason.split(': ')[1]
      return {
        body: `wrote: ${presentedText(post.details)}`,
        header: 'New Post in',
        onPress: () => navigate('Post Details', { id: post.id }),
        topic
      }

    case ACTION_JOIN_REQUEST:
      return {
        body: 'asked to join',
        community: community.name,
        header: 'New join request',
        nameInHeader: true,
        onPress: () => navigate('Settings')
      }

    case ACTION_APPROVED_JOIN_REQUEST:
      return {
        body: 'approved your request to join',
        community: community.name,
        header: 'Join Request Approved',
        onPress: () => navigate('Feed', { communityId: community.id })
      }
    case ACTION_ANNOUNCEMENT:
      return {
        body: `wrote: ${presentedText(post.title)}`,
        header: 'posted an announcement',
        onPress: () => navigate('Post Details', { id: post.id }),
        nameInHeader: true
      }
  }
}

export function refineNotification (navigation) {
  return ({ activity, createdAt, id }, i, notifications) => {
    const { action, actor, meta, unread } = activity
    // Only show separator between read and unread notifications

    const avatarSeparator = i !== notifications.length - 1
      ? unread !== notifications[i + 1].activity.unread
      : false

    return {
      id,
      activityId: activity.id,
      actor: pick(['avatarUrl', 'name'], actor),
      avatarSeparator,
      createdAt: humanDate(createdAt),
      ...refineActivity(activity, navigation),
      unread,
      reasons: meta.reasons
    }
  }
}

const getNotificationsResults = makeGetQueryResults(FETCH_NOTIFICATIONS)

export const getHasMoreNotifications = createSelector(
  getNotificationsResults,
  get('hasMore')
)

export const getNotifications = ormCreateSelector(
  orm,
  state => state.orm,
  (_, { navigation }) => navigation,
  (session, navigation) => session.Notification
    .all()
    .orderBy(m => Number(m.id), 'desc')
    .toModelArray()
    .map(refineNotification(navigation))
    .filter(n => n.reasons.every(r => reasonInWhitelist(r, NOTIFICATIONS_WHITELIST)))
)

export function reasonInWhitelist (reason, whitelist) {
  const reasonSubstring = reason.indexOf(':') === -1 ? reason : reason.substring(0, reason.indexOf(':'))
  const response = whitelist.indexOf(reasonSubstring) !== -1
  return response
}
