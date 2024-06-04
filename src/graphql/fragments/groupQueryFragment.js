import groupTopicsQueryFragment from 'graphql/fragments/groupTopicsQueryFragment'

// TODO: dont load all this unless looking at the explore page

export default () => {
  return `group(slug: $slug, updateLastViewed: $updateLastViewed) {
    id
    aboutVideoUri
    accessibility
    avatarUrl
    bannerUrl
    customViews {
      items {
        id
        groupId
        activePostsOnly
        collectionId
        defaultSort
        defaultViewMode
        externalLink
        isActive
        icon
        name
        order
        postTypes
        topics {
          id
          name
        }
        type
      }
    }
    description
    geoShape
    location
    memberCount
    moderatorDescriptor
    moderatorDescriptorPlural
    name
    purpose
    settings {
      agreementsLastUpdatedAt
      allowGroupInvites
      askGroupToGroupJoinQuestions
      askJoinQuestions
      hideExtensionData
      locationDisplayPrecision
      publicMemberDirectory
      showSuggestedSkills
    }
    slug
    type
    typeDescriptor
    typeDescriptorPlural
    visibility
    agreements {
      items {
        id
        description
        order
        title
      }
    }
    childGroups {
      items {
        id
        accessibility
        avatarUrl
        type
        bannerUrl
        description
        geoShape
        memberCount
        name
        slug
        visibility
        settings {
          agreementsLastUpdatedAt
          allowGroupInvites
          askGroupToGroupJoinQuestions
          askJoinQuestions
          hideExtensionData
          locationDisplayPrecision
          publicMemberDirectory
          showSuggestedSkills
        }
      }
    }
    groupRelationshipInvitesFrom {
      items {
        id
        toGroup {
          id
          name
          slug
        }
        fromGroup {
          id
        }
        type
        createdBy {
          id
          name
        }
      }
    }
    groupRelationshipInvitesTo {
      items {
        id
        fromGroup {
          id
          name
          slug
        }
        toGroup {
          id
        }
        type
        createdBy {
          id
          name
        }
        questionAnswers {
          id
          question {
            id
            text
          }
          answer
        }
      }
    }
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
    members(first: 8, sortBy: "last_active_at", order: "desc") {
      items {
        id
        avatarUrl
        lastActiveAt
        name
      }
    }
    moderators {
      items {
        id
        avatarUrl
        lastActiveAt
        name
      }
    }
    parentGroups {
      items {
        id
        accessibility
        avatarUrl
        bannerUrl
        description
        geoShape
        name
        slug
        visibility
        settings {
          agreementsLastUpdatedAt
          allowGroupInvites
          askGroupToGroupJoinQuestions
          askJoinQuestions
          hideExtensionData
          locationDisplayPrecision
          publicMemberDirectory
          showSuggestedSkills
        }
        type
      }
    }
    widgets {
      items {
        id
        name
        isVisible
        order
        context
        settings {
          text
          title
        }
      }
    }
    ${groupTopicsQueryFragment}
  }`
}
