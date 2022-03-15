import { get } from 'lodash/fp'
import { LOGIN } from 'store/constants'

export default function login (email, password) {
  return {
    type: LOGIN,
    graphql: {
      query: `mutation ($email: String, $password: String) {
        createSession(email: $email, password: $password) {
          me {
            id
            email
            emailValidated
            hasRegistered
            name
            settings {
              alreadySeenTour
              digestFrequency
              dmNotifications
              commentNotifications
              signupInProgress
              streamViewMode
              streamSortBy
              streamPostType
            }
          }
        }
      }`,
      variables: {
        email,
        password
      }
    },
    meta: {
      extractModel: [
        {
          getRoot: get('createSession.me'),
          modelName: 'Me'
        }
      ]
    }
  }
}
