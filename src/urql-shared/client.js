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
  'Post',
  'Comment',
  'Group'
  // Add more types as necessary
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

const customKeys = {
  GroupQuerySet: (data) => data.parent.id
  // Define keys for other entity types as needed
}

const cache = cacheExchange({
  typePolicies,
  customKeys
})

const client = createClient({
  url: `${apiHost}/noo/graphql`,
  exchanges: [devtoolsExchange, cache, fetchExchange]
})

export default client
