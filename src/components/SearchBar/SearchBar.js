import React from 'react'
import { TextInput, View } from 'react-native'

import Icon from '../../Icon'
import styles from './SearchBar.styles'

export function SearchBar ({ term, setTerm }) {
  return <View style={styles.searchBar}>
    <Icon style={styles.searchIcon} name='Search' />
    <TextInput
      style={styles.searchInput}
      value={term}
      onChangeText={setTerm}
      placeholder='Search Topics'
      underlineColorAndroid='transparent'
      autoCorrect={false}
      editable />
  </View>
}
