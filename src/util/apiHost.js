import Config from 'react-native-config'

Config.NODE_ENV !== 'test' && console.log(`API host: ${Config.API_HOST}`)

export default Config.API_HOST
