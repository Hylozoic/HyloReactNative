import { LOGIN_BY_TOKEN } from 'store/constants'

export default function loginByToken (userId, loginToken) {
  return {
    type: LOGIN_BY_TOKEN,
    payload: {
      api: { method: 'post', path: '/noo/login/token', params: { u: userId, t: loginToken } }
    }
  }
}
