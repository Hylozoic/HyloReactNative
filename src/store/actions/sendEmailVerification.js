import { SEND_EMAIL_VERIFICATION } from 'store/constants'

export function sendEmailVerification (email) {
  return {
    type: SEND_EMAIL_VERIFICATION,
    payload: {
      api: {
        method: 'post',
        path: '/noo/user/send-email-verification',
        params: {
          email
        }
      }
    }
  }
}
