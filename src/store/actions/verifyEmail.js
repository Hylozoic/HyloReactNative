import { get } from 'lodash/fp'
import { VERIFY_EMAIL } from 'store/constants'

export default function verifyEmail (email, code, token) {
  return {
    type: VERIFY_EMAIL,
    graphql: {
      query: `mutation ($code: String, $email: String, $token: String) {
        verifyEmail(code: $code, email: $email, token: $token) {
          id
          active
          email
          emailValidated
          hasRegistered
          name
        }
      }`,
      variables: {
        code,
        email,
        token
      }
    },
    meta: {
      extractModel: [
        {
          getRoot: get('verifyEmail'),
          modelName: 'Me'
        }
      ]
    }
  }
}
