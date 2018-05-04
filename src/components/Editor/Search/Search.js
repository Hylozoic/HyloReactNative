import React from 'react'
import {
  FlatList,
  Image,
  Text,
  TextInput,
  TouchableOpacity,
  View
} from 'react-native'

import Icon from '../../Icon'
import TopicList from '../../TopicList'
import { SearchType } from './Search.store'
import styles from './Search.styles'
import { rhino30 } from 'style/colors'

export default class Search extends React.Component {
  render () {
    const { style, type, results, onSelect, updateSearch, onCancel } = this.props

    const renderItem = ({ item }) =>
      <SearchResult item={item} type={type} onPress={() => onSelect(item)} />

    return <View style={[styles.container, style]}>
      <View style={styles.inputWrapper}>
        <Icon name='Search' style={styles.inputIcon} />
        <TextInput
          autoFocus
          onChangeText={updateSearch}
          autoCapitalize='none'
          placeholder={setPlaceholder(type)}
          placeholderTextColor={rhino30}
          style={styles.input}
          underlineColorAndroid='transparent' />
        <TouchableOpacity onPress={onCancel}>
          <Icon name='Ex' style={styles.cancelButton} />
        </TouchableOpacity>
      </View>
      <View style={styles.resultsWrapper}>
        {type === SearchType.TOPIC
          ? <TopicList topics={results} touchAction={onSelect} />
          : <FlatList data={results}
            renderItem={renderItem}
            keyExtractor={item => item.id}
            keyboardShouldPersistTaps='handled' />}
      </View>
    </View>
  }
}

export function setPlaceholder (type) {
  return `Search for a ${type} by name`
}

function SearchResult ({ item: { name, avatarUrl }, type, onPress }) {
  const s = styles.result
  return <TouchableOpacity style={s.container} onPress={onPress}>
    {!!avatarUrl && <Image source={{uri: avatarUrl}} style={s.avatar} />}
    <Text>{name}</Text>
  </TouchableOpacity>
}
