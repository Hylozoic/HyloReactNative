const postFieldsFragment = () => `
  id
  announcement
  title
  details
  type
  creator {
    id
    name
    avatarUrl
    groupRoles {
      items {
        id
        name
        emoji
        active
        groupId
        responsibilities {
          items {
            id
            title
            description
          }
        }
      }
    }
    membershipCommonRoles {
      items {
        id
        commonRoleId
        groupId
        userId
      }
    }
  }
  createdAt
  clickthrough
  updatedAt
  flaggedGroups
  isAnonymousVote
  isPublic
  fulfilledAt
  startTime
  endTime
  donationsLink
  projectManagementLink
  myEventResponse
  commenters(first: 20) {
    id
    name
    avatarUrl
  }
  commentersTotal
  commentsTotal
  linkPreview {
    description
    id
    imageUrl
    title
    url
  }
  linkPreviewFeatured
  location
  locationObject {
    id
    addressNumber
    addressStreet
    bbox {
      lat
      lng
    }
    center {
      lat
      lng
    }
    city
    country
    fullText
    locality
    neighborhood
    region
  }
  peopleReactedTotal
  proposalStatus
  proposalOutcome
  votingMethod
  quorum
  proposalOptions {
    total
    hasMore
    items {
      id
      text
      emoji
    }
  }
  proposalVotes {
      total
      hasMore
      items {
        id
        optionId
        user {
          id
          name
          avatarUrl
        }
      }
  }
  myReactions {
    emojiFull
    id
  }
  postReactions {
    emojiFull
    id
    user {
      id
      name
    }
  }
  groups {
    id
    name
    slug
  }
  attachments {
    type
    url
    position
    id
  }
  postMemberships {
    id
    pinned
    group {
      id
    }
  }
  topics {
    id
    name
    postsTotal
    followersTotal
  }
  members {
    total
    hasMore
    items {
      id
      name
      avatarUrl
      bio
      tagline
      location
    }
  }
  eventInvitations {
    total
    hasMore
    items {
      id
      response
      person {
        id
        name
        avatarUrl
        bio
        tagline
        location
      }
    }
  }
`

export default postFieldsFragment
