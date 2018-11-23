import React from 'react'
import { TextInput, TouchableOpacity, View } from 'react-native'

import Icon from '../Icon'
import styles from './SearchBar.styles'

export default function SearchBar ({
  term,
  setTerm,
  type = 'topics',
  placeholder = undefined,
  onCancel = undefined
}) {
  return <View style={styles.searchBar}>
    <Icon style={styles.searchIcon} name='Search' />
    <TextInput
      style={styles.searchInput}
      value={term}
      onChangeText={setTerm} // updateSearch
      placeholder={placeholder || setPlaceholder(type)}
      underlineColorAndroid='transparent'
      autoCorrect={false}
      editable />
    {onCancel && <TouchableOpacity onPress={onCancel}>
      <Icon name='Ex' style={styles.cancelButton} />
    </TouchableOpacity>}
  </View>
}

export function setPlaceholder (type) {
  switch (type) {
    case 'topics':
      return 'Search Topics'
    default:
      return `Search for a ${type} by name`
  }
}
