import { isEmpty } from 'lodash'
import RNRestart from 'react-native-restart'
import { LoginManager as FacebookLoginManager } from 'react-native-fbsdk-next'
import { GoogleSignin } from '@react-native-google-signin/google-signin'
import { clearSessionCookie } from 'util/session'
import { LOGOUT } from 'store/constants'

export default function logout () {
  return {
    type: LOGOUT,
    payload: {
      api: { path: '/noo/session', method: 'DELETE' }
    },
    meta: {
      then: async () => {
        await clearSessionCookie()
        await FacebookLoginManager.logOut()
        if (!isEmpty(await GoogleSignin.getCurrentUser())) {
          await GoogleSignin.signOut()
        }
        // RNRestart.Restart()
      }
    }
  }
}
