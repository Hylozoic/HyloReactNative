import { clearSessionCookie } from '../../util/session'

import { LoginManager } from 'react-native-fbsdk'
import { GoogleSignin } from 'react-native-google-signin'

export const LOGIN = 'LOGIN'
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
    payload: () =>
      clearSessionCookie()
      .then(() => LoginManager.logOut())
      .then(() => GoogleSignin.currentUser() && GoogleSignin.signOut())
      .then(() => ({
        api: {method: 'delete', path: '/noo/session'}
      }))
  }
}
