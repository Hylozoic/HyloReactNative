export const LOGIN_WITH_APPLE = 'LOGIN_WITH_APPLE'
export const LOGIN_WITH_FACEBOOK = 'LOGIN_WITH_FACEBOOK'
export const LOGIN_WITH_GOOGLE = 'LOGIN_WITH_GOOGLE'

export function loginWithApple (params) {
  return {
    type: LOGIN_WITH_APPLE,
    payload: {
      api: { method: 'post', path: '/noo/login/apple/oauth', params }
    }
  }
}

export function loginWithFacebook (accessToken) {
  return {
    type: LOGIN_WITH_FACEBOOK,
    payload: {
      api: { method: 'post', path: `/noo/login/facebook-token/oauth?access_token=${accessToken}` }
    }
  }
}

export function loginWithGoogle (accessToken) {
  return {
    type: LOGIN_WITH_GOOGLE,
    payload: {
      api: { method: 'post', path: `/noo/login/google-token/oauth?access_token=${accessToken}` }
    }
  }
}