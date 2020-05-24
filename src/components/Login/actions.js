import { clearSessionCookie } from '../../util/session'
import { LoginManager } from 'react-native-fbsdk'
import { GoogleSignin } from '@react-native-community/google-signin'
import { isEmpty } from 'lodash'

export const LOGIN = 'LOGIN'
export const LOGIN_BY_TOKEN = 'LOGIN_BY_TOKEN'
export const LOGIN_WITH_FACEBOOK = 'LOGIN_WITH_FACEBOOK'
export const LOGIN_WITH_GOOGLE = 'LOGIN_WITH_GOOGLE'
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

export function loginByToken (userId, loginToken) {
  return {
    type: LOGIN_BY_TOKEN,
    payload: {
      api: {method: 'post', path: '/noo/login/token', params: {u: userId, t: loginToken}}
    }
  }
}

export function loginWithFacebook (accessToken) {
  return {
    type: LOGIN_WITH_FACEBOOK,
    payload: {
      api: {method: 'post', path: `/noo/login/facebook-token/oauth?access_token=${accessToken}`}
    }
  }
}

export function loginWithGoogle (accessToken) {
  return {
    type: LOGIN_WITH_GOOGLE,
    payload: {
      api: {method: 'post', path: `/noo/login/google-token/oauth?access_token=${accessToken}`}
    }
  }
}

export function logout () {
  return {
    type: LOGOUT,
    payload: {
      api: {
        method: 'delete',
        path: '/noo/session',
        transform: () =>
          clearSessionCookie()
          .then(() => LoginManager.logOut())
          .then(() => {
            if (!isEmpty(GoogleSignin.currentUser())) {
              return GoogleSignin.signOut()
            }
          })
      }
    }
  }
}
