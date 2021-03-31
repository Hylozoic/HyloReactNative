import { connect } from 'react-redux'
import getGroup from 'store/selectors/getGroup'
import getMyJoinRequests from 'store/selectors/getMyJoinRequests'
import isPendingFor from 'store/selectors/isPendingFor'
import {
  JOIN_GROUP, CREATE_JOIN_REQUEST, FETCH_GROUP_SETTINGS
} from 'store/constants'

export function mapStateToProps (state, props) {
  const groupId = props.route.params.groupId
  const alreadyRequested = getMyJoinRequests(state, props)
    .find(r => r.group.id === groupId)
  const group = getGroup(state, { id: groupId })
  
  return {
    group,
    alreadyRequested,
    loading: isPendingFor([JOIN_GROUP, CREATE_JOIN_REQUEST,  FETCH_GROUP_SETTINGS], state)
  }
}

export const mapDispatchToProps = {
  fetchGroupJoinSettings,
  joinGroup,
  createJoinRequest
}

export default connect(mapStateToProps, mapDispatchToProps)

// Actions

export function joinGroup (groupId) {
  return {
    type: JOIN_GROUP,
    graphql: {
      query: `
        mutation ($groupId: ID) {
          joinGroup(groupId: $groupId) {
            id
            role
            hasModeratorRole
            group {
              id
              name
              slug
            }
            person {
              id
            }
          }
        }
      `,
      variables: {
        groupId
      }
    },
    meta: {
      extractModel: 'Membership',
      groupId,
      optimistic: true
    }
  }
}

export function createJoinRequest (groupId, questionAnswers) {
  return {
    type: CREATE_JOIN_REQUEST,
    graphql: {
      query: `
        mutation ($groupId: ID, $questionAnswers: [QuestionAnswerInput]) {
          createJoinRequest(groupId: $groupId, questionAnswers: $questionAnswers) {
            request {
              id
              user {
                id
              }
              group {
                id
              }
              createdAt
              updatedAt
              status
            }
          }
        }
      `,
      variables: { groupId, questionAnswers }
    },
    meta: {
      groupId,
      optimistic: true
    }
  }
}

export function fetchGroupJoinSettings (groupId) {
  return {
    type: FETCH_GROUP_SETTINGS,
    graphql: {
      query: `
        query ($groupId: ID) {
          group (id: $groupId) {
            id
            settings {
              allowGroupInvites
              askJoinQuestions
            }
            joinQuestions {
              items {
                id
                questionId
                text
              }
            }
          }
        }
      `,
      variables: {
        groupId
      }
    },
    meta: {
      extractModel: 'Group'
    }
  }
}
