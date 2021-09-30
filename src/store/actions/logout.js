import { isEmpty } from 'lodash'
import { LoginManager } from 'react-native-fbsdk-next'
import { GoogleSignin } from '@react-native-google-signin/google-signin'
import { LOGOUT } from 'store/constants'
import { clearSessionCookie } from 'util/session'

export default function logout () {
  return {
    type: LOGOUT,
    payload: {
      api: {
        method: 'delete',
        path: '/noo/session',
        transform: () =>
          clearSessionCookie()
            .then(() =>
              LoginManager.logOut()
            )
            // TODO: This should be already handled by the same code in login/actions/Logout
            .then(async () => {
              if (!isEmpty(await GoogleSignin.getCurrentUser())) {
                return GoogleSignin.signOut()
              }
            })
      }
    }
  }
}
