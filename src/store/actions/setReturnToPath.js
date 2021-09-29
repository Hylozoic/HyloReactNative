import url from 'url'
import { STORE_RETURN_TO_PATH } from 'store/constants'

export default function setReturnToPath (pathOrURL) {
  return {
    type: STORE_RETURN_TO_PATH,
    payload: pathOrURL
      ? url.parse(pathOrURL).pathname
      : null
  }
}
