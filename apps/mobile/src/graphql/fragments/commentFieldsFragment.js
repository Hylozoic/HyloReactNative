export default `
id
text
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
attachments {
  id
  position
  type
  url
}
parentComment {
  id
}
myReactions {
  emojiFull
  id
}
commentReactions {
  emojiFull
  id
  user {
    id
    name
  }
}
createdAt
`
