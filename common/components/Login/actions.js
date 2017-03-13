import { clearSessionCookie } from '../../util/session'

export const LOGIN = 'LOGIN'
export const LOGOUT = 'LOGOUT'

export function login (email, password) {
  return {
    type: LOGIN,
    payload: {
      api: {method: 'post', path: '/noo/login', params: {email, password}}
    },
    meta: {email}
  }
}

export function logout () {
  return {
    type: LOGOUT,
    payload: clearSessionCookie().then(() => ({
      api: {method: 'delete', path: '/noo/session'}
    }))
  }
}
