import React from 'react'
import {
  FlatList,
  Image,
  KeyboardAvoidingView,
  Text,
  TextInput,
  TouchableOpacity,
  View
} from 'react-native'
import { keyboardAvoidingViewProps as kavProps } from 'util/viewHelpers'
import Icon from '../Icon'
import styles from './Search.styles'

export default class Search extends React.Component {
  static navigationOptions = ({ navigation }) => ({
    headerTitle: navigation.state.params.title
  })

  render () {
    const { type, results, select, updateSearch } = this.props

    const renderItem = ({ item }) =>
      <SearchResult item={item} type={type} onPress={() => select(item)} />

    return <KeyboardAvoidingView style={styles.container} {...kavProps}>
      <View style={styles.inputWrapper}>
        <Icon name='Search' style={styles.inputIcon} />
        <TextInput style={styles.input} autoFocus
          onChangeText={updateSearch} />
      </View>
      <View style={styles.resultsWrapper}>
        <FlatList data={results}
          renderItem={renderItem}
          keyExtractor={item => item.id}
          keyboardShouldPersistTaps='handled' />
      </View>
    </KeyboardAvoidingView>
  }
}

function SearchResult ({ item: { name, avatarUrl }, type, onPress }) {
  const s = styles.result
  return <TouchableOpacity style={s.container} onPress={onPress}>
    {!!avatarUrl && <Image source={{uri: avatarUrl}} style={s.avatar} />}
    <Text>{type}: {name}</Text>
  </TouchableOpacity>
}
