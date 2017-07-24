/**
 * @providesModule util/websockets
 */

import socketIo from 'socket.io-client'
import sailsIo from 'sails.io.js'
import { HOST } from '../fetchJSON'
import { getSessionCookie } from '../session'

// socket host is same as API host in development, different in production
const socketHost = process.env.SOCKET_HOST || HOST

let socket

export function getSocket () {
  if (socket) return Promise.resolve(socket)

  const io = sailsIo(socketIo)
  io.sails.environment = process.env.NODE_ENV || 'development'
  io.sails.reconnection = true
  io.sails.autoConnect = false

  // sails.io.js ordinarily uses JSONP to get the cookie, which won't work in a
  // native environment. so we disable that and depend upon having the session
  // cookie already stored from a previous HTTP request.
  io.sails.useCORSRouteToGetCookie = false

  return getSessionCookie().then(cookie => {
    if (!cookie) {
      throw new Error('You must have a session cookie before creating a websocket.')
    }

    io.sails.headers = {cookie}
    socket = io.sails.connect(socketHost)

    // shim socket.request to include cookie
    socket.__originalRequest = socket.request
    socket.request = function (opts, cb) {
      if (!opts.headers) opts.headers = {}
      opts.headers.Cookie = cookie // key must be capitalized
      return this.__originalRequest(opts, cb)
    }

    return socket
  })
}

export function socketUrl (path) {
  return `${socketHost}/${path.replace(/^\//, '')}`
}
