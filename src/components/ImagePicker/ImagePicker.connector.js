import { connect } from 'react-redux'
import apiHost from 'util/apiHost'
import Request from './Request'

const UPLOAD = 'UPLOAD'

export function upload (type, id, file) {
  const url = apiHost + '/noo/upload'

  const request = Request.create(url, 'POST')
  .set('type', type)
  .set('id', id)
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
    })
  }
}

export default connect(null, {upload}, null, {withRef: true})
