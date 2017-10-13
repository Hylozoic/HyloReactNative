import { getSocket } from './index'
import { setSessionCookie } from '../session'

const mockStorage = {}

jest.mock('react-native', () => ({
  AsyncStorage: {
    setItem: (key, value) => {
      mockStorage[key] = value
      return Promise.resolve()
    },
    getItem: key => Promise.resolve(mockStorage[key])
  },
  Platform: {OS: 'ios'},
  NativeModules: {
    RNDeviceInfo: {}
  }
}))

jest.mock('sails.io.js', () => {
  return (socketConstructor) => ({
    sails: {
      connect: host => socketConstructor(host, {autoConnect: false})
    }
  })
})

jest.mock('react-native-device-info')

const mockHeaders = {
  'set-cookie': 'foo=bar'
}

const mockResp = {
  headers: {
    get: key => mockHeaders[key]
  }
}

let singletonSocket

it('throws an error without a session cookie', () => {
  expect.assertions(1)
  return getSocket()
  .catch(err => expect(err.message).toMatch(/must have a session cookie/))
})

it('uses the session cookie', () => {
  return setSessionCookie(mockResp)
  .then(() => getSocket())
  .then(socket => {
    expect(socket).toBeTruthy()
    singletonSocket = socket
    socket.__originalRequest = jest.fn()
    const callback = () => {}
    socket.request({}, callback)
    expect(socket.__originalRequest)
    .toBeCalledWith({headers: {Cookie: 'foo=bar'}}, callback)
  })
})

it('returns the singleton', () => {
  return getSocket()
  .then(socket => expect(socket).toEqual(singletonSocket))
})
