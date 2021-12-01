import { VERIFY_EMAIL } from 'store/constants'

export default function verifyEmail (email, code) {
  return {
    type: VERIFY_EMAIL,
    payload: {
      api: {
        method: 'post',
        path: '/noo/user/verify-email',
        params: {
          email,
          code
        }
      }
    }
  }
}
