import { STORE_RETURN_TO_PATH } from "store/constants"

export default function setReturnToPath (path) {
  return {
    type: STORE_RETURN_TO_PATH,
    payload: path
  }
}
