import config from './config.json'
import { createIconSet } from 'react-native-vector-icons'

const glyphMap = config.icons.reduce((m, { tags, defaultCode }) => {
  m[tags[0]] = defaultCode
  return m
}, {})

export default createIconSet(glyphMap, 'hylo-evo-icons')
