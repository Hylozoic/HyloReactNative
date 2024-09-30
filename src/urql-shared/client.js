import { createClient, fetchExchange } from 'urql'
import { cacheExchange } from '@urql/exchange-graphcache'
import { devtoolsExchange } from '@urql/devtools'
import apiHost from 'util/apiHost'
import { simplePagination } from '@urql/exchange-graphcache/extras'
import cursorPagination from './cursorPagination'

// Explicit recognition of the lack of an id field on a selection set avoids a URQL warning:
// https://commerce.nearform.com/open-source/urql/docs/graphcache/normalized-caching
const customKeys = {
  AffiliationQuerySet: () => null,
  ActivityMeta: () => null,
  AgreementQuerySet: () => null,
  CommentQuerySet: () => null,
  CustomViewQuerySet: () => null,
  EventInvitationQuerySet: () => null,
  GroupJoinQuestionQuerySet: () => null,
  GroupQuerySet: () => null,
  GroupRole: () => null,
  GroupRoleQuerySet: () => null,
  GroupSettings: () => null,
  JoinRequestQuerySet: () => null,
  Location: () => null,
  MemberSettings: () => null,
  Membership: () => null,
  MembershipSettings: () => null,
  MembershipCommonRoleQuerySet: () => null,
  NotificationQuerySet: () => null,
  PersonQuerySet: () => null,
  Point: () => null,
  PostQuerySet: () => null,
  ProposalOptionQuerySet: () => null,
  ProposalVoteQuerySet: () => null,
  ResponsibilityQuerySet: () => null,
  SkillQuerySet: () => null,
  UserSettings: () => null
}

const cache = cacheExchange({
  keys: customKeys,
  resolvers: {
    Query: {
      threadList: cursorPagination(),
      posts: simplePagination({ offsetArgument: 'offset', limitArgument: 'first' })
    },
    Post: {
      comments: cursorPagination()
    },
    Comment: {
      childComments: cursorPagination()
    }
  }
})

const client = createClient({
  url: `${apiHost}/noo/graphql`,
  exchanges: [devtoolsExchange, cache, fetchExchange]
})

export default client
