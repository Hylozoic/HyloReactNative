// adapted from https://raw.githubusercontent.com/benjreinhart/react-native-aws3/master/src/Request.js
// https://github.com/benjreinhart/react-native-aws3/blob/master/LICENSE.txt

/* globals FormData, XMLHttpRequest */

const isBlank = string =>
  string === null || !/\S/.test(string)

const notBlank = string =>
  !isBlank(string)

const parseHeaders = (xhr) => {
  return (xhr.getAllResponseHeaders() || '')
    .split(/\r?\n/)
    .filter(notBlank)
    .reduce((headers, headerString) => {
      let header = headerString.split(':')[0]
      headers[header] = xhr.getResponseHeader(header)
      return headers
    }, {})
}

const buildResponseObject = (xhr) => {
  let headers = {}
  try {
    headers = parseHeaders(xhr)
  } catch (e) {};
  return {
    status: xhr.status,
    text: xhr.responseText,
    headers: headers
  }
}

const buildResponseHandler = (xhr, resolve, reject) => {
  return () => {
    let fn = xhr.status === 0 ? reject : resolve
    fn(buildResponseObject(xhr))
  }
}

const decorateProgressFn = (fn) => {
  return (e) => {
    e.percent = e.loaded / e.total
    return fn(e)
  }
}

export default class Request {
  static create (...args) {
    return new this(...args)
  }

  constructor (url, method, headers = {}) {
    this._xhr = new Request.XMLHttpRequest()
    this._formData = new Request.FormData()

    this._xhr.open(method, url)

    this._promise = new Promise((resolve, reject) => {
      this._xhr.onload = buildResponseHandler(this._xhr, resolve, reject)
      this._xhr.onerror = buildResponseHandler(this._xhr, resolve, reject)
    })

    Object.keys(headers).forEach((k) => this.header(k, headers[k]))
  }

  header (key, value) {
    this._xhr.setRequestHeader(key, value)
    return this
  }

  set (key, value) {
    this._formData.append(key, value)
    return this
  }

  send () {
    this._xhr.send(this._formData)
    return this
  }

  abort () {
    this._xhr.abort()
    return this
  }

  progress (fn) {
    if (this._xhr.upload) {
      this._xhr.upload.onprogress = decorateProgressFn(fn)
    }
    return this
  }

  then (...args) {
    this._promise = this._promise.then(...args)
    return this
  }

  catch (...args) {
    this._promise = this._promise.catch(...args)
    return this
  }
}

Request.FormData = FormData
Request.XMLHttpRequest = XMLHttpRequest
