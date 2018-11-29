import React from 'react'
import {
  View,
  TouchableOpacity,
  TextInput,
  Text
} from 'react-native'
import Icon from '../Icon'
import styles from './SearchBar.styles'
import Loading from '../Loading'

export default function SearchBar ({
  value = '',
  onChangeText,
  type = 'topics',
  placeholder = undefined,
  onCancel = undefined,
  onCancelText = undefined,
  loading = undefined,
  autoFocus = false
}) {
  const Cancel = () => onCancelText
    ? <Text style={styles.cancelText}>{onCancelText}</Text>
    : <Icon name='Ex' style={styles.cancelButton} />

  return <View style={styles.searchBar}>
    <Icon style={styles.searchIcon} name='Search' />
    <TextInput
      autoFocus={autoFocus}
      style={styles.searchInput}
      value={value}
      onChangeText={onChangeText} // updateSearch
      placeholder={placeholder || setPlaceholder(type)}
      underlineColorAndroid='transparent'
      autoCorrect={false}
      editable />
    {loading && <Loading style={styles.loading} />}
    {!loading && value.length > 0 && onCancel && <TouchableOpacity style={styles.cancel} onPress={onCancel}>
      <Cancel />
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
