import React from 'react'
import { createIconSetFromFontello } from 'react-native-vector-icons'
import config from '../style/icon-config.json'
const Icon = createIconSetFromFontello(config)

export default function ({ src, size, color = '#000', styles, selected }) {
  return <Icon name={src} style={styles} {...{size, color, selected}} />
}
