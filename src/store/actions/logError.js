import { LOG_ERROR } from 'store/constants'

export default function logError (error, extra) {
  return {
    type: LOG_ERROR,
    payload: {
      api: {method: 'post', path: '/noo/mobile/logerror', params: {error, extra}}
    }
  }
}
