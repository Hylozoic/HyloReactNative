import { URL } from 'react-native-url-polyfill'
import { SET_RETURN_TO_PATH } from 'store/constants'

export default function setReturnToPath (pathOrURL) {
  return {
    type: SET_RETURN_TO_PATH,
    payload: pathOrURL && new URL(pathOrURL)?.pathname
  }
}
