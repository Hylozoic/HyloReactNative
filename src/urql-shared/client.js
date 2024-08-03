import { createClient, fetchExchange } from 'urql'
import { cacheExchange } from '@urql/exchange-graphcache'
import { devtoolsExchange } from '@urql/devtools'
import apiHost from 'util/apiHost'

const mergePaginationResults = (existing = {}, incoming) => {
  if (!existing.items) {
    return incoming
  }

  const mergedItems = [...existing.items]

  incoming.items.forEach((incomingItem) => {
    const existingItemIndex = mergedItems.findIndex(item => item.id === incomingItem.id)

    if (existingItemIndex === -1) {
      mergedItems.push(incomingItem)
    } else {
      mergedItems[existingItemIndex] = {
        ...mergedItems[existingItemIndex],
        ...incomingItem,
        items: incomingItem.items ? mergePaginationResults(mergedItems[existingItemIndex].items, incomingItem.items).items : incomingItem.items
      }
    }
  })

  return {
    ...incoming,
    items: mergedItems
  }
}

// List of types that contain the items field
const typesWithItemsField = [
  'GroupPostsQuery',
  'CommentQuerySet',
  'NotificationQuerySet',
  'GroupQuerySet',
  'GroupJoinQuestionQuerySet',
  'PostQuerySet'
]

const generateTypePolicies = (types) => {
  const typePolicies = {}

  types.forEach((type) => {
    typePolicies[type] = {
      fields: {
        items: {
          merge: mergePaginationResults
        }
      }
    }
  })

  return typePolicies
}

const typePolicies = generateTypePolicies(typesWithItemsField)

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
  SkillQuerySet: () => null,
  UserSettings: () => null
}

const cache = cacheExchange({
  typePolicies,
  keys: customKeys
})

const client = createClient({
  url: `${apiHost}/noo/graphql`,
  exchanges: [devtoolsExchange, cache, fetchExchange]
})

export default client
