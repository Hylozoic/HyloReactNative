/**
 * @providesModule store/actions/upload
 */

import apiHost from 'util/apiHost'
import Request from 'util/Request'

const UPLOAD = 'UPLOAD'

export default function upload (type, id, file) {
  const url = apiHost + '/noo/upload'

  const request = Request.create(url, 'POST')
  .set('type', type)
  .set('id', id || 'new')
  .set('file', file)

  return {
    type: UPLOAD,
    payload: request.send()
    .then(resp => {
      let { status, text } = resp
      if (status === 200) return JSON.parse(text)

      const error = new Error(text)
      error.response = {status}
      throw error
    }),
    meta: {type, id}
  }
}
