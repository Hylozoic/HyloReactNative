import React, { Component, PropTypes } from 'react'
import { createIconSetFromFontello } from 'react-native-vector-icons';
import config from './icon-config.json';
let Icon = createIconSetFromFontello(config);

let icon = ({ src, size, color = '#000', styles, selected }) => (
  <Icon name={src} size={size} color={color} style={styles} selected={selected}/>
)

icon.propTypes = {
  src     : React.PropTypes.string,
  size    : React.PropTypes.number,
  color   : React.PropTypes.string,
  styles  : React.PropTypes.object,
  selected: React.PropTypes.boolean
}

module.exports = icon;
