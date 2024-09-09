const cursorPagination = (entity) => {
  return (parent, args, cache, info) => {
    // Retrieve the existing cached items for the entity (comments or messageThreads)
    const existingData = cache.resolve(
      cache.keyOfEntity(parent),
      entity,
      args
    ) || { items: [] }

    // Merge existing items with newly fetched items
    const mergedItems = [
      ...existingData.items,
      ...parent[entity].items
    ]

    // Return the merged result, maintaining `hasMore`
    return {
      ...parent[entity],
      items: mergedItems
    }
  }
}

export default cursorPagination
