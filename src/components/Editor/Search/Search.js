import React from 'react'
import {
  Button,
  FlatList,
  Image,
  Text,
  TextInput,
  TouchableOpacity,
  View
} from 'react-native'
import Icon from '../../Icon'
import styles from './Search.styles'
import { SearchType } from './Search.store'

export default class Search extends React.Component {
  render () {
    const { style, type, results, onSelect, updateSearch, onCancel } = this.props

    const renderItem = ({ item }) =>
      <SearchResult item={item} type={type} onPress={() => onSelect(item)} />

    const placeholder = type === SearchType.MENTION
      ? 'Search for a person by name'
      : 'Search for a topic by name'

    return <View style={[styles.container, style]}>
      <View style={styles.inputWrapper}>
        <Icon name='Search' style={styles.inputIcon} />
        <TextInput style={styles.input} autoFocus onChangeText={updateSearch}
          placeholder={placeholder} />
        <Button title='Cancel' onPress={onCancel} />
      </View>
      <View style={styles.resultsWrapper}>
        <FlatList data={results}
          renderItem={renderItem}
          keyExtractor={item => item.id}
          keyboardShouldPersistTaps='handled' />
      </View>
    </View>
  }
}

function SearchResult ({ item: { name, avatarUrl }, type, onPress }) {
  const s = styles.result
  return <TouchableOpacity style={s.container} onPress={onPress}>
    {!!avatarUrl && <Image source={{uri: avatarUrl}} style={s.avatar} />}
    <Text>{name}</Text>
  </TouchableOpacity>
}
