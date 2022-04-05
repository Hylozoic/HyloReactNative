import { isEmpty } from 'lodash'
import RNRestart from 'react-native-restart'
import { LoginManager } from 'react-native-fbsdk-next'
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
        await LoginManager.logOut()
        // TODO: This should be already handled by the same code in login/actions/Logout
        if (!isEmpty(await GoogleSignin.getCurrentUser())) {
          await GoogleSignin.signOut()
        }
        RNRestart.Restart()
      }
    }
  }
}
