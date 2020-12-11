import { CHECK_SESSION_AND_SET_SIGNED_IN } from '../constants'
import { getSessionCookie } from 'util/session'

export default async function checkSessionAndSetSignedIn () {
  const cookie = await getSessionCookie()
  const payload = cookie ? {
    api: {
      path: '/noo/user/status',
      transform: json => {
        console.log('!!!! json in checkSessionAndSetSignedIn:', json)
        return !!json.signedIn
      } 
    }
  } : false

  return {
    type: CHECK_SESSION_AND_SET_SIGNED_IN,
    payload
  }
}
