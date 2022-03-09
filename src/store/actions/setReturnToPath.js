import { URL } from 'react-native-url-polyfill'
import { STORE_RETURN_TO_PATH } from 'store/constants'

export default function setReturnToPath (pathOrURL) {
  return {
    type: STORE_RETURN_TO_PATH,
    payload: pathOrURL && new URL(pathOrURL)?.pathname
  }
}
